
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

interface UserRow extends RowDataPacket {
    user_id: number;
    full_name: string;
    email: string;
    password_hash: string;
    is_active: number;
}

interface RoleRow extends RowDataPacket {
    role_id: number;
}

// REGISTER
const register = async (req: Request, res: Response) => {
    const { full_name, email, password, phone } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "Full name, email and password are required"
        });
    }

    if (
        typeof password !== "string" ||
        password.length < 8
    ) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    if (
        typeof full_name !== "string" ||
        typeof email !== "string" ||
        (phone !== undefined && typeof phone !== "string")
    ) {
        return res.status(400).json({
            message: "Invalid input data"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO users
            (full_name, email, password_hash, phone)
            VALUES (?, ?, ?, ?)`,
            [
                full_name.trim(),
                email.trim().toLowerCase(),
                hashedPassword,
                phone || null
            ]
        );

        const [roles] = await connection.execute<RoleRow[]>(
            "SELECT role_id FROM roles WHERE role_name = ?",
            ["Customer"]
        );

        const customerRole = roles[0];

        if (!customerRole) {
            throw new Error("Customer role not found");
        }

        await connection.execute(
            `INSERT INTO user_roles (user_id, role_id)
            VALUES (?, ?)`,
            [result.insertId, customerRole.role_id]
        );

        await connection.commit();

        return res.status(201).json({
            message: "Account registered successfully",
            user_id: result.insertId
        });

    } catch (error: unknown) {
        await connection.rollback();

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed"
        });

    } finally {
        connection.release();
    }
};

// LOGIN
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Valid email and password are required"
        });
    }

    try {
        const [rows] = await pool.execute<UserRow[]>(
            `SELECT user_id, full_name, email,
            password_hash, is_active
            FROM users
            WHERE email = ?
            LIMIT 1`,
            [email.trim().toLowerCase()]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            { userId: user.user_id },
            secret,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed"
        });
    }
};

export { register, login };
