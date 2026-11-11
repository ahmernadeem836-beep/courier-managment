
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/database.js";

interface MerchantRow extends RowDataPacket {
    merchant_id: number;
    user_id: number | null;
    business_name: string;
    contact_person: string;
    email: string;
    phone: string;
    pickup_address: string;
    city: string;
    is_active: number;
}

interface CustomerRow extends RowDataPacket {
    customer_id: number;
    user_id: number | null;
    full_name: string;
    email: string | null;
    phone: string;
    address: string;
    city: string;
    is_active: number;
}

// ---------------- MERCHANTS ----------------

// GET ALL MERCHANTS
export const getAllMerchants = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<MerchantRow[]>(
            `SELECT * FROM merchants ORDER BY merchant_id DESC`
        );
        return res.status(200).json({ count: rows.length, merchants: rows });
    } catch (error) {
        console.error("Get merchants error:", error);
        return res.status(500).json({ message: "Failed to fetch merchants" });
    }
};

// GET MERCHANT BY ID
export const getMerchantById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid merchant ID" });
        }

        const [rows] = await pool.execute<MerchantRow[]>(
            "SELECT * FROM merchants WHERE merchant_id = ?",
            [id]
        );

        if (!rows[0]) return res.status(404).json({ message: "Merchant not found" });
        return res.status(200).json({ merchant: rows[0] });
    } catch (error) {
        console.error("Get merchant error:", error);
        return res.status(500).json({ message: "Failed to fetch merchant" });
    }
};

// CREATE MERCHANT
export const createMerchant = async (req: Request, res: Response) => {
    try {
        const {
            user_id, business_name, contact_person,
            email, phone, pickup_address, city
        } = req.body;

        if (
            typeof business_name !== "string" || !business_name.trim() ||
            typeof contact_person !== "string" || !contact_person.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof phone !== "string" || !phone.trim() ||
            typeof pickup_address !== "string" || !pickup_address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({
                message: "Business name, contact person, email, phone, pickup address and city are required"
            });
        }

        if (user_id != null && (!Number.isInteger(user_id) || user_id <= 0)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO merchants
            (user_id, business_name, contact_person, email, phone, pickup_address, city)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id ?? null, business_name.trim(), contact_person.trim(),
                email.trim().toLowerCase(), phone.trim(),
                pickup_address.trim(), city.trim()
            ]
        );

        return res.status(201).json({
            message: "Merchant created successfully",
            merchant_id: result.insertId
        });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email or linked user already exists"
            });
        }
        console.error("Create merchant error:", error);
        return res.status(500).json({ message: "Failed to create merchant" });
    }
};

// UPDATE MERCHANT
export const updateMerchant = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const {
            business_name, contact_person,
            email, phone, pickup_address, city
        } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid merchant ID" });
        }

        if (
            typeof business_name !== "string" || !business_name.trim() ||
            typeof contact_person !== "string" || !contact_person.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof phone !== "string" || !phone.trim() ||
            typeof pickup_address !== "string" || !pickup_address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({ message: "All merchant fields are required" });
        }

        const [existing] = await pool.execute<MerchantRow[]>(
            "SELECT merchant_id FROM merchants WHERE merchant_id = ?",
            [id]
        );
        if (!existing[0]) return res.status(404).json({ message: "Merchant not found" });

        await pool.execute(
            `UPDATE merchants
             SET business_name = ?, contact_person = ?, email = ?,
                 phone = ?, pickup_address = ?, city = ?
             WHERE merchant_id = ?`,
            [
                business_name.trim(), contact_person.trim(),
                email.trim().toLowerCase(), phone.trim(),
                pickup_address.trim(), city.trim(), id
            ]
        );

        return res.status(200).json({ message: "Merchant updated successfully" });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("Update merchant error:", error);
        return res.status(500).json({ message: "Failed to update merchant" });
    }
};

// DEACTIVATE MERCHANT
export const deactivateMerchant = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid merchant ID" });
        }

        const [rows] = await pool.execute<MerchantRow[]>(
            "SELECT merchant_id, is_active FROM merchants WHERE merchant_id = ?",
            [id]
        );

        if (!rows[0]) return res.status(404).json({ message: "Merchant not found" });
        if (!rows[0].is_active) {
            return res.status(400).json({ message: "Merchant is already inactive" });
        }

        await pool.execute(
            "UPDATE merchants SET is_active = FALSE WHERE merchant_id = ?",
            [id]
        );

        return res.status(200).json({ message: "Merchant deactivated successfully" });
    } catch (error) {
        console.error("Deactivate merchant error:", error);
        return res.status(500).json({ message: "Failed to deactivate merchant" });
    }
};

// ---------------- CUSTOMERS ----------------

// GET ALL CUSTOMERS
export const getAllCustomers = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<CustomerRow[]>(
            `SELECT * FROM customers ORDER BY customer_id DESC`
        );
        return res.status(200).json({ count: rows.length, customers: rows });
    } catch (error) {
        console.error("Get customers error:", error);
        return res.status(500).json({ message: "Failed to fetch customers" });
    }
};

// GET CUSTOMER BY ID
export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        const [rows] = await pool.execute<CustomerRow[]>(
            "SELECT * FROM customers WHERE customer_id = ?",
            [id]
        );

        if (!rows[0]) return res.status(404).json({ message: "Customer not found" });
        return res.status(200).json({ customer: rows[0] });
    } catch (error) {
        console.error("Get customer error:", error);
        return res.status(500).json({ message: "Failed to fetch customer" });
    }
};

// CREATE CUSTOMER
export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { user_id, full_name, email, phone, address, city } = req.body;

        if (
            typeof full_name !== "string" || !full_name.trim() ||
            typeof phone !== "string" || !phone.trim() ||
            typeof address !== "string" || !address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({
                message: "Full name, phone, address and city are required"
            });
        }

        if (email != null && (typeof email !== "string" || !email.trim())) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user_id != null && (!Number.isInteger(user_id) || user_id <= 0)) {
            return res.status(400).json({ message: "Invalid user_id" });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO customers
            (user_id, full_name, email, phone, address, city)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id ?? null, full_name.trim(),
                email?.trim().toLowerCase() || null,
                phone.trim(), address.trim(), city.trim()
            ]
        );

        return res.status(201).json({
            message: "Customer created successfully",
            customer_id: result.insertId
        });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email or linked user already exists"
            });
        }
        console.error("Create customer error:", error);
        return res.status(500).json({ message: "Failed to create customer" });
    }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { full_name, email, phone, address, city } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        if (
            typeof full_name !== "string" || !full_name.trim() ||
            typeof phone !== "string" || !phone.trim() ||
            typeof address !== "string" || !address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({ message: "Name, phone, address and city are required" });
        }

        const [existing] = await pool.execute<CustomerRow[]>(
            "SELECT customer_id FROM customers WHERE customer_id = ?",
            [id]
        );
        if (!existing[0]) return res.status(404).json({ message: "Customer not found" });

        await pool.execute(
            `UPDATE customers
             SET full_name = ?, email = ?, phone = ?, address = ?, city = ?
             WHERE customer_id = ?`,
            [
                full_name.trim(), email?.trim().toLowerCase() || null,
                phone.trim(), address.trim(), city.trim(), id
            ]
        );

        return res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error("Update customer error:", error);
        return res.status(500).json({ message: "Failed to update customer" });
    }
};

// DEACTIVATE CUSTOMER
export const deactivateCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        const [rows] = await pool.execute<CustomerRow[]>(
            "SELECT customer_id, is_active FROM customers WHERE customer_id = ?",
            [id]
        );

        if (!rows[0]) return res.status(404).json({ message: "Customer not found" });
        if (!rows[0].is_active) {
            return res.status(400).json({ message: "Customer is already inactive" });
        }

        await pool.execute(
            "UPDATE customers SET is_active = FALSE WHERE customer_id = ?",
            [id]
        );

        return res.status(200).json({ message: "Customer deactivated successfully" });
    } catch (error) {
        console.error("Deactivate customer error:", error);
        return res.status(500).json({ message: "Failed to deactivate customer" });
    }
};
