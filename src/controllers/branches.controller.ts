
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/database.js";

interface BranchRow extends RowDataPacket {
    branch_id: number;
    branch_name: string;
    branch_code: string;
    address: string;
    city: string;
    phone: string | null;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}

// GET ALL BRANCHES
export const getAllBranches = async (_req: Request, res: Response) => {
    try {
        const [branches] = await pool.execute<BranchRow[]>(
            `SELECT * FROM branches ORDER BY branch_id DESC`
        );

        return res.status(200).json({
            count: branches.length,
            branches
        });
    } catch (error) {
        console.error("Get branches error:", error);
        return res.status(500).json({ message: "Failed to fetch branches" });
    }
};

// GET BRANCH BY ID
export const getBranchById = async (req: Request, res: Response) => {
    try {
        const branchId = Number(req.params.id);

        if (!Number.isInteger(branchId) || branchId <= 0) {
            return res.status(400).json({ message: "Invalid branch ID" });
        }

        const [branches] = await pool.execute<BranchRow[]>(
            "SELECT * FROM branches WHERE branch_id = ?",
            [branchId]
        );

        if (!branches[0]) {
            return res.status(404).json({ message: "Branch not found" });
        }

        return res.status(200).json({ branch: branches[0] });
    } catch (error) {
        console.error("Get branch error:", error);
        return res.status(500).json({ message: "Failed to fetch branch" });
    }
};

// CREATE BRANCH
export const createBranch = async (req: Request, res: Response) => {
    try {
        const { branch_name, branch_code, address, city, phone } = req.body;

        if (
            typeof branch_name !== "string" || !branch_name.trim() ||
            typeof branch_code !== "string" || !branch_code.trim() ||
            typeof address !== "string" || !address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({
                message: "Branch name, code, address and city are required"
            });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO branches
            (branch_name, branch_code, address, city, phone)
            VALUES (?, ?, ?, ?, ?)`,
            [
                branch_name.trim(),
                branch_code.trim().toUpperCase(),
                address.trim(),
                city.trim(),
                typeof phone === "string" && phone.trim() ? phone.trim() : null
            ]
        );

        return res.status(201).json({
            message: "Branch created successfully",
            branch_id: result.insertId
        });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Branch code already exists"
            });
        }

        console.error("Create branch error:", error);
        return res.status(500).json({ message: "Failed to create branch" });
    }
};

// UPDATE BRANCH
export const updateBranch = async (req: Request, res: Response) => {
    try {
        const branchId = Number(req.params.id);
        const { branch_name, branch_code, address, city, phone } = req.body;

        if (!Number.isInteger(branchId) || branchId <= 0) {
            return res.status(400).json({ message: "Invalid branch ID" });
        }

        if (
            typeof branch_name !== "string" || !branch_name.trim() ||
            typeof branch_code !== "string" || !branch_code.trim() ||
            typeof address !== "string" || !address.trim() ||
            typeof city !== "string" || !city.trim()
        ) {
            return res.status(400).json({
                message: "Branch name, code, address and city are required"
            });
        }

        const [existing] = await pool.execute<BranchRow[]>(
            "SELECT * FROM branches WHERE branch_id = ?",
            [branchId]
        );

        if (!existing[0]) {
            return res.status(404).json({ message: "Branch not found" });
        }

        await pool.execute(
            `UPDATE branches
             SET branch_name = ?, branch_code = ?, address = ?,
                 city = ?, phone = ?
             WHERE branch_id = ?`,
            [
                branch_name.trim(),
                branch_code.trim().toUpperCase(),
                address.trim(),
                city.trim(),
                typeof phone === "string" && phone.trim() ? phone.trim() : null,
                branchId
            ]
        );

        return res.status(200).json({ message: "Branch updated successfully" });
    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Branch code already exists" });
        }

        console.error("Update branch error:", error);
        return res.status(500).json({ message: "Failed to update branch" });
    }
};

// DEACTIVATE BRANCH
export const deactivateBranch = async (req: Request, res: Response) => {
    try {
        const branchId = Number(req.params.id);

        if (!Number.isInteger(branchId) || branchId <= 0) {
            return res.status(400).json({ message: "Invalid branch ID" });
        }

        const [existing] = await pool.execute<BranchRow[]>(
            "SELECT branch_id, is_active FROM branches WHERE branch_id = ?",
            [branchId]
        );

        if (!existing[0]) {
            return res.status(404).json({ message: "Branch not found" });
        }

        if (!existing[0].is_active) {
            return res.status(400).json({ message: "Branch is already inactive" });
        }

        await pool.execute(
            "UPDATE branches SET is_active = FALSE WHERE branch_id = ?",
            [branchId]
        );

        return res.status(200).json({ message: "Branch deactivated successfully" });
    } catch (error) {
        console.error("Deactivate branch error:", error);
        return res.status(500).json({ message: "Failed to deactivate branch" });
    }
};
