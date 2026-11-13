
import type { Request, Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

interface ActiveUserRow extends RowDataPacket {
    is_active: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
            };
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication token required"
        });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return res.status(401).json({
            message: "Invalid authentication"
        });
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            typeof decoded.userId !== "number" ||
            !Number.isInteger(decoded.userId) ||
            decoded.userId <= 0
        ) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        const [rows] = await pool.execute<ActiveUserRow[]>(
            `SELECT is_active
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [decoded.userId]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        req.user = {
            userId: decoded.userId
        };

        return next();

    } catch (error) {
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.TokenExpiredError
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Authentication failed"
        });
    }
};
