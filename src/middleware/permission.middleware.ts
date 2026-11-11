
import type { Request, Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import pool from "../config/database.js";

interface PermissionRow extends RowDataPacket {
    permission_name: string;
}

export const requirePermission = (permissionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const [permissions] = await pool.execute<PermissionRow[]>(
                `SELECT DISTINCT p.permission_name
                 FROM users u
                 JOIN user_roles ur ON u.user_id = ur.user_id
                 JOIN role_permissions rp ON ur.role_id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.permission_id
                 WHERE u.user_id = ?
                 AND u.is_active = TRUE`,
                [userId]
            );

            const hasPermission = permissions.some(
                permission =>
                    permission.permission_name === permissionName
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: "You do not have permission to perform this action"
                });
            }

            return next();

        } catch (error) {
            console.error("Permission check error:", error);

            return res.status(500).json({
                message: "Permission verification failed"
            });
        }
    };
};
