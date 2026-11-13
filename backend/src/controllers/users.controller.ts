
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

interface UserRow extends RowDataPacket {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: number;
    created_at: Date;
}

interface RoleRow extends RowDataPacket {
    role_id: number;
}

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.execute<UserRow[]>(
            `SELECT user_id, full_name, email, phone,
                    is_active, created_at
             FROM users
             ORDER BY user_id DESC`
        );

        return res.json({ users });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const [users] = await pool.execute<UserRow[]>(
            `SELECT user_id, full_name, email, phone,
                    is_active, created_at
             FROM users
             WHERE user_id = ?`,
            [userId]
        );

        if (!users[0]) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user: users[0] });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
    const { full_name, email, password, phone, role_id } = req.body;

    const creatorId = req.user?.userId;

    if (
        typeof full_name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !full_name.trim() ||
        !email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        password.length < 8 ||
        !Number.isInteger(role_id) ||
        role_id <= 0 ||
        (phone !== undefined && phone !== null && typeof phone !== "string") ||
        !creatorId
    ) {
        return res.status(400).json({
            message: "Valid name, email, password (8+ characters), phone and role ID are required"
        });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check whether requested role exists
        const [roles] = await connection.execute<RoleRow[]>(
            "SELECT role_id FROM roles WHERE role_id = ?",
            [role_id]
        );

        if (!roles[0]) {
            await connection.rollback();

            return res.status(400).json({
                message: "Invalid role ID"
            });
        }

        // Only Super Admin can assign Super Admin role
        if (role_id === 1) {
            const [creatorRoles] = await connection.execute<RoleRow[]>(
                `SELECT role_id
                 FROM user_roles
                 WHERE user_id = ? AND role_id = 1`,
                [creatorId]
            );

            if (creatorRoles.length === 0) {
                await connection.rollback();

                return res.status(403).json({
                    message: "Only Super Admin can assign the Super Admin role"
                });
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO users (
                full_name,
                email,
                password_hash,
                phone
            ) VALUES (?, ?, ?, ?)`,
            [
                full_name.trim(),
                email.trim().toLowerCase(),
                passwordHash,
                phone?.trim() || null
            ]
        );

        // Assign role
        await connection.execute(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [result.insertId, role_id]
        );

        await connection.commit();

        return res.status(201).json({
            message: "User created successfully",
            user_id: result.insertId
        });

    } catch (error: any) {
        if (connection) {
            await connection.rollback();
        }

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to create user"
        });

    } finally {
        connection?.release();
    }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const { full_name, email, phone } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (
            typeof full_name !== "string" ||
            typeof email !== "string" ||
            !full_name.trim() ||
            !email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            (phone !== undefined && phone !== null && typeof phone !== "string")
        ) {
            return res.status(400).json({
                message: "Valid full name, email and phone are required"
            });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE users
             SET full_name = ?,
                 email = ?,
                 phone = ?
             WHERE user_id = ?`,
            [
                full_name.trim(),
                email.trim().toLowerCase(),
                phone?.trim() || null,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            message: "User updated successfully"
        });

    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to update user"
        });
    }
};

// DEACTIVATE USER
export const deactivateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (userId === req.user?.userId) {
            return res.status(400).json({
                message: "You cannot deactivate your own account"
            });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE users
             SET is_active = FALSE
             WHERE user_id = ? AND is_active = TRUE`,
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found or already inactive"
            });
        }

        return res.json({
            message: "User deactivated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to deactivate user"
        });
    }
};
