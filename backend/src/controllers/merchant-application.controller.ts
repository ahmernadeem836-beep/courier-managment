
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import pool from "../config/database.js";

interface MerchantRoleRow extends RowDataPacket {
    role_id: number;
}

interface MerchantApplicationRequest {
    businessName: string;
    businessType: string;
    businessCategory: string;

    website?: string;
    socialMediaLink?: string;
    registrationNumber?: string;
    businessDescription?: string;

    averageShipmentsPerDay: string;
    averageShipmentsPerMonth?: string;
    currentCourierPartner?: string;

    shippingCoverage: string;
    shippingCities?: string[] | string;

    pickupRequired: boolean | string;
    pickupAddress?: string;

    paymentMethod: string;
    expectedCodVolume?: string;

    contactPerson: string;
    email: string;
    phone: string;
    alternatePhone?: string;

    businessAddress: string;
    businessCity: string;

    returnAddress: string;
    returnCity: string;
    returnArea: string;
    returnContactPerson: string;
    returnContactNumber: string;

    password: string;
}

const toNullableString = (
    value: string | undefined
): string | null => {
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : null;
};

const isPickupRequired = (
    value: boolean | string
): boolean => {
    if (typeof value === "boolean") {
        return value;
    }

    return value.toLowerCase() === "yes" ||
        value.toLowerCase() === "true";
};

export const registerMerchantApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    const body = req.body as MerchantApplicationRequest;

    const requiredFields = [
        body.businessName,
        body.businessType,
        body.businessCategory,
        body.averageShipmentsPerDay,
        body.shippingCoverage,
        body.paymentMethod,
        body.contactPerson,
        body.email,
        body.phone,
        body.businessAddress,
        body.businessCity,
        body.returnAddress,
        body.returnCity,
        body.returnArea,
        body.returnContactPerson,
        body.returnContactNumber,
        body.password
    ];

    if (
        requiredFields.some(
            value => typeof value !== "string" || !value.trim()
        )
    ) {
        res.status(400).json({
            message: "Please provide all required fields."
        });
        return;
    }

    const email = body.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({
            message: "Please provide a valid email address."
        });
        return;
    }

    if (body.password.length < 8) {
        res.status(400).json({
            message: "Password must be at least 8 characters long."
        });
        return;
    }

    const pickupRequired = isPickupRequired(body.pickupRequired);

    if (pickupRequired && !body.pickupAddress?.trim()) {
        res.status(400).json({
            message: "Pickup address is required when pickup is selected."
        });
        return;
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check whether this email already has a user account
        const [existingUsers] = await connection.execute<RowDataPacket[]>(
            `SELECT user_id
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();

            res.status(409).json({
                message: "An account with this email already exists."
            });
            return;
        }

        // 2. Find the existing Merchant role
        const [merchantRoles] = await connection.execute<MerchantRoleRow[]>(
            `SELECT role_id
             FROM roles
             WHERE role_name = ?
             LIMIT 1`,
            ["Merchant"]
        );

        if (merchantRoles.length === 0) {
            throw new Error("Merchant role was not found in the database.");
        }

        const merchantRole = merchantRoles[0];

if (!merchantRole) {
    throw new Error("Merchant role was not found in the database.");
}

const merchantRoleId = merchantRole.role_id;

        // 3. Hash password
        const passwordHash = await bcrypt.hash(body.password, 12);

        // 4. Create inactive user account
        const [userResult] = await connection.execute<ResultSetHeader>(
            `INSERT INTO users
                (full_name, email, password_hash, phone, is_active)
             VALUES (?, ?, ?, ?, FALSE)`,
            [
                body.contactPerson.trim(),
                email,
                passwordHash,
                body.phone.trim()
            ]
        );

        const userId = userResult.insertId;

        // 5. Assign Merchant role
        await connection.execute<ResultSetHeader>(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [userId, merchantRoleId]
        );

        // 6. Convert shipping cities to text for database storage
        const shippingCities = Array.isArray(body.shippingCities)
            ? JSON.stringify(body.shippingCities)
            : toNullableString(body.shippingCities);

        // 7. Create pending merchant application
        await connection.execute<ResultSetHeader>(
            `INSERT INTO merchant_applications (
                user_id,
                business_name,
                business_type,
                business_category,
                website,
                social_media_link,
                registration_number,
                business_description,
                average_shipments_per_day,
                average_shipments_per_month,
                current_courier_partner,
                shipping_coverage,
                shipping_cities,
                pickup_required,
                pickup_address,
                payment_method,
                expected_cod_volume,
                contact_person,
                email,
                phone,
                alternate_phone,
                business_address,
                business_city,
                return_address,
                return_city,
                return_area,
                return_contact_person,
                return_contact_number,
                status
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending'
            )`,
            [
                userId,
                body.businessName.trim(),
                body.businessType.trim(),
                body.businessCategory.trim(),
                toNullableString(body.website),
                toNullableString(body.socialMediaLink),
                toNullableString(body.registrationNumber),
                toNullableString(body.businessDescription),
                body.averageShipmentsPerDay.trim(),
                toNullableString(body.averageShipmentsPerMonth),
                toNullableString(body.currentCourierPartner),
                body.shippingCoverage.trim(),
                shippingCities,
                pickupRequired,
                pickupRequired
                    ? toNullableString(body.pickupAddress)
                    : null,
                body.paymentMethod.trim(),
                toNullableString(body.expectedCodVolume),
                body.contactPerson.trim(),
                email,
                body.phone.trim(),
                toNullableString(body.alternatePhone),
                body.businessAddress.trim(),
                body.businessCity.trim(),
                body.returnAddress.trim(),
                body.returnCity.trim(),
                body.returnArea.trim(),
                body.returnContactPerson.trim(),
                body.returnContactNumber.trim()
            ]
        );

        // 8. Commit all database changes
        await connection.commit();

        res.status(201).json({
            message: "Merchant application submitted successfully.",
            status: "pending"
        });

    } catch (error) {
        await connection.rollback();

        console.error("Merchant application error:", error);

        res.status(500).json({
            message: "Could not submit merchant application."
        });

    } finally {
        connection.release();
    }
};
