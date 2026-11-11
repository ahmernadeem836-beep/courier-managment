
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/database.js";

interface RoleRow extends RowDataPacket {
    role_id: number;
    role_name: string;
    description: string | null;
    created_at: Date;
}

interface PermissionRow extends RowDataPacket {
    permission_id: number;
    permission_name: string;
    description: string | null;
}

interface RolePermissionRow extends RowDataPacket {
    permission_id: number;
    permission_name: string;
    description: string | null;
}

// GET ALL ROLES
export const getAllRoles = async (_req: Request, res: Response) => {
    try {
        const [roles] = await pool.execute<RoleRow[]>(
            `SELECT role_id, role_name, description, created_at
             FROM roles
             ORDER BY role_id`
        );

        return res.status(200).json({ count: roles.length, roles });
    } catch (error) {
        console.error("Get roles error:", error);
        return res.status(500).json({ message: "Failed to fetch roles" });
    }
};

// GET ROLE BY ID
export const getRoleById = async (req: Request, res: Response) => {
    try {
        const roleId = Number(req.params.id);

        if (!Number.isInteger(roleId) || roleId <= 0) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        const [roles] = await pool.execute<RoleRow[]>(
            `SELECT role_id, role_name, description, created_at
             FROM roles WHERE role_id = ?`,
            [roleId]
        );

        if (!roles[0]) {
            return res.status(404).json({ message: "Role not found" });
        }

        return res.status(200).json({ role: roles[0] });
    } catch (error) {
        console.error("Get role error:", error);
        return res.status(500).json({ message: "Failed to fetch role" });
    }
};

// CREATE ROLE
export const createRole = async (req: Request, res: Response) => {
    try {
        const { role_name, description } = req.body;

        if (typeof role_name !== "string" || !role_name.trim()) {
            return res.status(400).json({ message: "Role name is required" });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO roles (role_name, description)
             VALUES (?, ?)`,
            [role_name.trim(), description?.trim() || null]
        );

        return res.status(201).json({
            message: "Role created successfully",
            role_id: result.insertId,
            role_name: role_name.trim()
        });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Role already exists" });
        }

        console.error("Create role error:", error);
        return res.status(500).json({ message: "Failed to create role" });
    }
};

// UPDATE ROLE
export const updateRole = async (req: Request, res: Response) => {
    try {
        const roleId = Number(req.params.id);
        const { role_name, description } = req.body;

        if (!Number.isInteger(roleId) || roleId <= 0) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        if (typeof role_name !== "string" || !role_name.trim()) {
            return res.status(400).json({ message: "Role name is required" });
        }

        const [existing] = await pool.execute<RoleRow[]>(
            "SELECT role_id FROM roles WHERE role_id = ?",
            [roleId]
        );

        if (!existing[0]) {
            return res.status(404).json({ message: "Role not found" });
        }

        await pool.execute(
            `UPDATE roles
             SET role_name = ?, description = ?
             WHERE role_id = ?`,
            [role_name.trim(), description?.trim() || null, roleId]
        );

        return res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Role name already exists" });
        }

        console.error("Update role error:", error);
        return res.status(500).json({ message: "Failed to update role" });
    }
};

// GET ALL PERMISSIONS
export const getAllPermissions = async (_req: Request, res: Response) => {
    try {
        const [permissions] = await pool.execute<PermissionRow[]>(
            `SELECT permission_id, permission_name, description
             FROM permissions
             ORDER BY permission_id`
        );

        return res.status(200).json({
            count: permissions.length,
            permissions
        });
    } catch (error) {
        console.error("Get permissions error:", error);
        return res.status(500).json({ message: "Failed to fetch permissions" });
    }
};

// GET PERMISSIONS OF A ROLE
export const getRolePermissions = async (req: Request, res: Response) => {
    try {
        const roleId = Number(req.params.id);

        if (!Number.isInteger(roleId) || roleId <= 0) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        const [roles] = await pool.execute<RoleRow[]>(
            "SELECT role_id, role_name FROM roles WHERE role_id = ?",
            [roleId]
        );

        if (!roles[0]) {
            return res.status(404).json({ message: "Role not found" });
        }

        const [permissions] = await pool.execute<RolePermissionRow[]>(
            `SELECT p.permission_id, p.permission_name, p.description
             FROM role_permissions rp
             JOIN permissions p ON rp.permission_id = p.permission_id
             WHERE rp.role_id = ?
             ORDER BY p.permission_id`,
            [roleId]
        );

        return res.status(200).json({
            role: roles[0],
            count: permissions.length,
            permissions
        });
    } catch (error) {
        console.error("Get role permissions error:", error);
        return res.status(500).json({ message: "Failed to fetch role permissions" });
    }
};

// ASSIGN / REPLACE PERMISSIONS FOR A ROLE
export const assignPermissionsToRole = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();

    try {
        const roleId = Number(req.params.id);
        const { permission_ids } = req.body;

        if (!Number.isInteger(roleId) || roleId <= 0) {
            return res.status(400).json({ message: "Invalid role ID" });
        }

        if (
            !Array.isArray(permission_ids) ||
            !permission_ids.every(
                (id: unknown) => Number.isInteger(id) && Number(id) > 0
            )
        ) {
            return res.status(400).json({
                message: "permission_ids must be an array of positive integers"
            });
        }

        const uniquePermissionIds = [...new Set(permission_ids as number[])];

        await connection.beginTransaction();

        const [roles] = await connection.execute<RoleRow[]>(
            "SELECT role_id FROM roles WHERE role_id = ?",
            [roleId]
        );

        if (!roles[0]) {
            await connection.rollback();
            return res.status(404).json({ message: "Role not found" });
        }

        if (uniquePermissionIds.length > 0) {
            const placeholders = uniquePermissionIds.map(() => "?").join(",");

            const [permissions] = await connection.execute<PermissionRow[]>(
                `SELECT permission_id FROM permissions
                 WHERE permission_id IN (${placeholders})`,
                uniquePermissionIds
            );

            if (permissions.length !== uniquePermissionIds.length) {
                await connection.rollback();
                return res.status(400).json({
                    message: "One or more permission IDs do not exist"
                });
            }
        }

        await connection.execute(
            "DELETE FROM role_permissions WHERE role_id = ?",
            [roleId]
        );

        for (const permissionId of uniquePermissionIds) {
            await connection.execute(
                `INSERT INTO role_permissions (role_id, permission_id)
                 VALUES (?, ?)`,
                [roleId, permissionId]
            );
        }

        await connection.commit();

        return res.status(200).json({
            message: "Role permissions updated successfully",
            role_id: roleId,
            permission_ids: uniquePermissionIds
        });
    } catch (error) {
        await connection.rollback();
        console.error("Assign permissions error:", error);
        return res.status(500).json({ message: "Failed to assign permissions" });
    } finally {
        connection.release();
    }
};
