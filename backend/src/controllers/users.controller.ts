import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

// ==============================
// INTERFACES
// ==============================

interface UserQueryRow extends RowDataPacket {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: number;
    branch_id: number | null;
    branch_name: string | null;
    role_id: number | null;
    role_name: string | null;
    created_at: Date;
}

interface RoleRow extends RowDataPacket {
    role_id: number;
}

interface BranchRow extends RowDataPacket {
    branch_id: number;
}

interface FormattedUser {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: number;
    branch_id: number | null;
    branch_name: string | null;
    created_at: Date;
    roles: {
        role_id: number;
        role_name: string;
    }[];
}

// ==============================
// HELPER: FORMAT USERS
// ==============================

const formatUsers = (rows: UserQueryRow[]): FormattedUser[] => {
    const users = new Map<number, FormattedUser>();

    for (const row of rows) {
        if (!users.has(row.user_id)) {
            users.set(row.user_id, {
                user_id: row.user_id,
                full_name: row.full_name,
                email: row.email,
                phone: row.phone,
                is_active: row.is_active,
                branch_id: row.branch_id,
                branch_name: row.branch_name,
                created_at: row.created_at,
                roles: []
            });
        }

        const user = users.get(row.user_id)!;

        if (
            row.role_id !== null &&
            row.role_name !== null &&
            !user.roles.some(role => role.role_id === row.role_id)
        ) {
            user.roles.push({
                role_id: row.role_id,
                role_name: row.role_name
            });
        }
    }

    return Array.from(users.values());
};

// ==============================
// HELPER: USER QUERY
// ==============================

const userQuery = `
    SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.phone,
        u.is_active,
        u.branch_id,
        b.branch_name,
        u.created_at,
        r.role_id,
        r.role_name
    FROM users u
    LEFT JOIN branches b
        ON u.branch_id = b.branch_id
    LEFT JOIN user_roles ur
        ON u.user_id = ur.user_id
    LEFT JOIN roles r
        ON ur.role_id = r.role_id
`;

// ==============================
// GET ALL USERS
// ==============================

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<UserQueryRow[]>(
            `${userQuery}
             ORDER BY u.user_id DESC, r.role_id`
        );

        const users = formatUsers(rows);

        return res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

// ==============================
// GET USER BY ID
// ==============================

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const [rows] = await pool.execute<UserQueryRow[]>(
            `${userQuery}
             WHERE u.user_id = ?
             ORDER BY r.role_id`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = formatUsers(rows)[0];

        return res.status(200).json({ user });

    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};

// ==============================
// CREATE USER
// ==============================

export const createUser = async (req: Request, res: Response) => {
    const {
        full_name,
        email,
        password,
        phone,
        role_id,
        branch_id
    } = req.body;

    const creatorId = req.user?.userId;

    const validBranchId =
        branch_id === undefined ||
        branch_id === null ||
        (Number.isInteger(branch_id) && branch_id > 0);

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
        !validBranchId ||
        (phone !== undefined && phone !== null && typeof phone !== "string") ||
        !creatorId
    ) {
        return res.status(400).json({
            message: "Valid name, email, password (8+ characters), phone, role ID and branch ID are required"
        });
    }

    let connection: Awaited<ReturnType<typeof pool.getConnection>> | undefined;
    let transactionStarted = false;

    try {
        connection = await pool.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        // Check role
        const [roles] = await connection.execute<RoleRow[]>(
            "SELECT role_id FROM roles WHERE role_id = ?",
            [role_id]
        );

        if (!roles[0]) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                message: "Invalid role ID"
            });
        }

        // Check branch, if provided
        if (branch_id !== undefined && branch_id !== null) {
            const [branches] = await connection.execute<BranchRow[]>(
                `SELECT branch_id
                 FROM branches
                 WHERE branch_id = ? AND is_active = TRUE`,
                [branch_id]
            );

            if (!branches[0]) {
                await connection.rollback();
                transactionStarted = false;

                return res.status(400).json({
                    message: "Invalid or inactive branch"
                });
            }
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
                transactionStarted = false;

                return res.status(403).json({
                    message: "Only Super Admin can assign the Super Admin role"
                });
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user with branch
        const [result] = await connection.execute<ResultSetHeader>(
            `INSERT INTO users (
                full_name,
                email,
                password_hash,
                phone,
                branch_id
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                full_name.trim(),
                email.trim().toLowerCase(),
                passwordHash,
                phone?.trim() || null,
                branch_id ?? null
            ]
        );

        // Assign role
        await connection.execute(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [result.insertId, role_id]
        );

        await connection.commit();
        transactionStarted = false;

        return res.status(201).json({
            message: "User created successfully",
            user_id: result.insertId
        });

    } catch (error) {
        if (connection && transactionStarted) {
            await connection.rollback();
        }

        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        console.error("Create user error:", error);

        return res.status(500).json({
            message: "Failed to create user"
        });

    } finally {
        connection?.release();
    }
};

// ==============================
// UPDATE USER
// ==============================

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        const {
            full_name,
            email,
            phone,
            branch_id
        } = req.body;

        const hasBranchId = Object.prototype.hasOwnProperty.call(
            req.body,
            "branch_id"
        );

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
            (phone !== undefined && phone !== null && typeof phone !== "string") ||
            (
                hasBranchId &&
                branch_id !== null &&
                (!Number.isInteger(branch_id) || branch_id <= 0)
            )
        ) {
            return res.status(400).json({
                message: "Valid full name, email, phone and branch ID are required"
            });
        }

        // Validate branch when provided
        if (hasBranchId && branch_id !== null) {
            const [branches] = await pool.execute<BranchRow[]>(
                `SELECT branch_id
                 FROM branches
                 WHERE branch_id = ? AND is_active = TRUE`,
                [branch_id]
            );

            if (!branches[0]) {
                return res.status(400).json({
                    message: "Invalid or inactive branch"
                });
            }
        }

        let query = `
            UPDATE users
            SET full_name = ?,
                email = ?,
                phone = ?
        `;

        const values: (string | number | null)[] = [
            full_name.trim(),
            email.trim().toLowerCase(),
            phone?.trim() || null
        ];

        if (hasBranchId) {
            query += ", branch_id = ?";
            values.push(branch_id ?? null);
        }

        query += " WHERE user_id = ?";
        values.push(userId);

        const [result] = await pool.execute<ResultSetHeader>(
            query,
            values
        );

        if (result.affectedRows === 0) {
            const [existing] = await pool.execute<UserQueryRow[]>(
                `${userQuery} WHERE u.user_id = ?`,
                [userId]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
        }

        return res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        console.error("Update user error:", error);

        return res.status(500).json({
            message: "Failed to update user"
        });
    }
};

// ==============================
// DEACTIVATE USER
// ==============================

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

        return res.status(200).json({
            message: "User deactivated successfully"
        });

    } catch (error) {
        console.error("Deactivate user error:", error);

        return res.status(500).json({
            message: "Failed to deactivate user"
        });
    }
};

// ==============================
// ACTIVATE USER
// ==============================

export const activateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE users
             SET is_active = TRUE
             WHERE user_id = ? AND is_active = FALSE`,
            [userId]
        );

        if (result.affectedRows === 0) {
            const [users] = await pool.execute<UserQueryRow[]>(
                `${userQuery} WHERE u.user_id = ?`,
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(409).json({
                message: "User is already active"
            });
        }

        return res.status(200).json({
            message: "User activated successfully"
        });

    } catch (error) {
        console.error("Activate user error:", error);

        return res.status(500).json({
            message: "Failed to activate user"
        });
    }
};