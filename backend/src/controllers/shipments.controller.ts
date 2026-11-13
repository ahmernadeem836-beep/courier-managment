
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/database.js";

// CREATE SHIPMENT
export const createShipment = async (req: Request, res: Response) => {
    const {
        merchant_id,
        customer_id,
        origin_branch_id,
        destination_branch_id,
        parcel_description,
        weight,
        cod_amount,
        shipping_charges,
        expected_delivery_date
    } = req.body;

    const created_by = req.user?.userId;

    if (
        !merchant_id ||
        !customer_id ||
        !origin_branch_id ||
        !destination_branch_id ||
        !weight ||
        !created_by
    ) {
        return res.status(400).json({
            message: "Required shipment fields are missing"
        });
    }

    if (
        Number(weight) <= 0 ||
        !Number.isFinite(Number(weight)) ||
        !Number.isFinite(Number(cod_amount ?? 0)) ||
        !Number.isFinite(Number(shipping_charges ?? 0)) ||
        Number(cod_amount ?? 0) < 0 ||
        Number(shipping_charges ?? 0) < 0
    ) {
        return res.status(400).json({
            message: "Invalid weight or amount values"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Validate active merchant
        const [merchantRows] = await connection.execute<RowDataPacket[]>(
            `SELECT merchant_id
             FROM merchants
             WHERE merchant_id = ? AND is_active = TRUE`,
            [merchant_id]
        );

        if (merchantRows.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Merchant not found or inactive"
            });
        }

        // 2. Validate active customer
        const [customerRows] = await connection.execute<RowDataPacket[]>(
            `SELECT customer_id
             FROM customers
             WHERE customer_id = ? AND is_active = TRUE`,
            [customer_id]
        );

        if (customerRows.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Customer not found or inactive"
            });
        }

        // 3. Validate active origin and destination branches
        const [branchRows] = await connection.execute<RowDataPacket[]>(
            `SELECT branch_id
             FROM branches
             WHERE branch_id IN (?, ?)
             AND is_active = TRUE`,
            [origin_branch_id, destination_branch_id]
        );

        if (branchRows.length !== 2) {
            await connection.rollback();

            return res.status(400).json({
                message: "One or both branches are inactive or do not exist"
            });
        }

        // 4. Generate tracking number
        const trackingNumber =
            `TRK${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

        // 5. Insert shipment
        const [shipmentResult] =
            await connection.execute<ResultSetHeader>(
                `INSERT INTO shipments (
                    tracking_number,
                    merchant_id,
                    customer_id,
                    origin_branch_id,
                    destination_branch_id,
                    parcel_description,
                    weight,
                    cod_amount,
                    shipping_charges,
                    status,
                    expected_delivery_date,
                    created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'booked', ?, ?)`,
                [
                    trackingNumber,
                    merchant_id,
                    customer_id,
                    origin_branch_id,
                    destination_branch_id,
                    parcel_description || null,
                    weight,
                    cod_amount ?? 0,
                    shipping_charges ?? 0,
                    expected_delivery_date || null,
                    created_by
                ]
            );

        // 6. Insert initial tracking history
        await connection.execute(
            `INSERT INTO shipment_tracking_history (
                shipment_id,
                status,
                location,
                remarks,
                updated_by
            ) VALUES (?, 'booked', ?, ?, ?)`,
            [
                shipmentResult.insertId,
                "Booking",
                "Shipment successfully booked",
                created_by
            ]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Shipment booked successfully",
            shipment_id: shipmentResult.insertId,
            tracking_number: trackingNumber,
            status: "booked"
        });

    } catch (error) {
        await connection.rollback();

        console.error("Create shipment error:", error);

        return res.status(500).json({
            message: "Failed to create shipment"
        });

    } finally {
        connection.release();
    }
};




export const getAllShipments = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // 1. Check Customer role and linked customer profile
        const [customerRows] = await pool.execute<RowDataPacket[]>(
            `SELECT c.customer_id
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.role_id
             LEFT JOIN customers c
                ON c.user_id = ur.user_id
                AND c.is_active = TRUE
             WHERE ur.user_id = ?
             AND r.role_name = 'Customer'
             LIMIT 1`,
            [userId]
        );

        const conditions: string[] = [];
        const params: (string | number)[] = [];

        // 2. Restrict Customer to their own shipments
        const customer = customerRows[0];

        if (customer) {
            if (customer.customer_id == null) {
                return res.status(403).json({
                    message: "Customer profile not found or inactive"
                });
            }

            conditions.push("s.customer_id = ?");
            params.push(Number(customer.customer_id));
        }

        const {
            status,
            tracking_number,
            merchant_id,
            customer_id
        } = req.query;

        const page = Math.max(
            1,
            Number(req.query.page) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, Number(req.query.limit) || 10)
        );

        const offset = (page - 1) * limit;

        // 3. Filter by status
        if (status) {
            if (typeof status !== "string") {
                return res.status(400).json({
                    message: "Invalid status filter"
                });
            }

            conditions.push("s.status = ?");
            params.push(status);
        }

        // 4. Search by tracking number
        if (tracking_number) {
            if (typeof tracking_number !== "string") {
                return res.status(400).json({
                    message: "Invalid tracking number filter"
                });
            }

            conditions.push("s.tracking_number LIKE ?");
            params.push(`%${tracking_number}%`);
        }

        // 5. Filter by merchant
        if (merchant_id) {
            const merchantId = Number(merchant_id);

            if (!Number.isInteger(merchantId) || merchantId <= 0) {
                return res.status(400).json({
                    message: "Invalid merchant ID"
                });
            }

            conditions.push("s.merchant_id = ?");
            params.push(merchantId);
        }

        // 6. Filter by customer
        if (customer_id) {
            const customerId = Number(customer_id);

            if (!Number.isInteger(customerId) || customerId <= 0) {
                return res.status(400).json({
                    message: "Invalid customer ID"
                });
            }

            conditions.push("s.customer_id = ?");
            params.push(customerId);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        // 7. Get total matching shipments
        const [countRows] = await pool.execute<RowDataPacket[]>(
            `SELECT COUNT(*) AS total
             FROM shipments s
             ${whereClause}`,
            params
        );

        const total = Number(countRows[0]?.total ?? 0);

        // 8. Get paginated shipment records
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT
                s.*,
                m.business_name,
                c.full_name AS customer_name,
                ob.branch_name AS origin_branch,
                db.branch_name AS destination_branch
             FROM shipments s
             JOIN merchants m ON s.merchant_id = m.merchant_id
             JOIN customers c ON s.customer_id = c.customer_id
             JOIN branches ob ON s.origin_branch_id = ob.branch_id
             JOIN branches db ON s.destination_branch_id = db.branch_id
             ${whereClause}
             ORDER BY s.created_at DESC, s.shipment_id DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        return res.status(200).json({
            message: "Shipments retrieved successfully",
            pagination: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit)
            },
            shipments: rows
        });

    } catch (error) {
        console.error("Get all shipments error:", error);

        return res.status(500).json({
            message: "Failed to retrieve shipments"
        });
    }
};



// GET SHIPMENT BY TRACKING NUMBER
export const getShipmentByTrackingNumber = async (
    req: Request,
    res: Response
) => {
    try {
        const trackingNumber = req.params.trackingNumber;

        if (!trackingNumber || Array.isArray(trackingNumber)) {
            return res.status(400).json({
                message: "Invalid tracking number"
            });
        }

        const [rows]: any = await pool.execute(
            `SELECT
                s.*,
                m.business_name,
                c.full_name AS customer_name,
                ob.branch_name AS origin_branch,
                db.branch_name AS destination_branch
             FROM shipments s
             JOIN merchants m ON s.merchant_id = m.merchant_id
             JOIN customers c ON s.customer_id = c.customer_id
             JOIN branches ob ON s.origin_branch_id = ob.branch_id
             JOIN branches db ON s.destination_branch_id = db.branch_id
             WHERE s.tracking_number = ?`,
            [trackingNumber]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        const [history]: any = await pool.execute(
            `SELECT
                status,
                location,
                remarks,
                created_at
             FROM shipment_tracking_history
             WHERE shipment_id = ?
             ORDER BY created_at ASC, history_id ASC`,
            [rows[0].shipment_id]
        );

        return res.status(200).json({
            shipment: rows[0],
            tracking_history: history
        });

    } catch (error) {
        console.error("Get shipment error:", error);

        return res.status(500).json({
            message: "Failed to retrieve shipment"
        });
    }
};


// UPDATE SHIPMENT STATUS

export const updateShipmentStatus = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    const { status, location, remarks } = req.body;
    const updated_by = req.user?.userId;

    const statusTransitions: Record<string, string[]> = {
        booked: ["pickup_scheduled", "cancelled"],
        pickup_scheduled: ["picked_up", "cancelled"],
        picked_up: ["at_origin_branch"],
        at_origin_branch: ["in_transit"],
        in_transit: ["at_destination_branch"],
        at_destination_branch: ["out_for_delivery"],
        out_for_delivery: ["delivered", "delivery_failed"],
        delivery_failed: ["out_for_delivery", "returned"],
        delivered: [],
        returned: [],
        cancelled: []
    };

    if (!id || Array.isArray(id) || !status || !updated_by) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    if (!Object.prototype.hasOwnProperty.call(statusTransitions, status)) {
        return res.status(400).json({
            message: "Invalid shipment status"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows]: any = await connection.execute(
            `SELECT shipment_id, status
             FROM shipments
             WHERE shipment_id = ?
             FOR UPDATE`,
            [id]
        );

        if (rows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        const currentStatus = rows[0].status;
        const allowedNextStatuses = statusTransitions[currentStatus];

        if (!allowedNextStatuses || !allowedNextStatuses.includes(status)) {
            await connection.rollback();

            return res.status(400).json({
                message: "Invalid status transition",
                current_status: currentStatus,
                allowed_next_statuses: allowedNextStatuses ?? []
            });
        }

        await connection.execute(
            `UPDATE shipments
             SET status = ?
             WHERE shipment_id = ?`,
            [status, id]
        );

        await connection.execute(
            `INSERT INTO shipment_tracking_history (
                shipment_id,
                status,
                location,
                remarks,
                updated_by
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                status,
                location || null,
                remarks || null,
                updated_by
            ]
        );

        await connection.commit();

        return res.status(200).json({
            message: "Shipment status updated successfully",
            shipment_id: Number(id),
            previous_status: currentStatus,
            current_status: status
        });

    } catch (error) {
        await connection.rollback();

        console.error("Update shipment status error:", error);

        return res.status(500).json({
            message: "Failed to update shipment status"
        });

    } finally {
        connection.release();
    }
};
