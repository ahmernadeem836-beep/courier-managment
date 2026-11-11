
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
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

export const authenticateToken = (
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
            typeof decoded === "string" ||
            typeof decoded.userId !== "number"
        ) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        req.user = {
            userId: decoded.userId
        };

        next();

    } catch {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
