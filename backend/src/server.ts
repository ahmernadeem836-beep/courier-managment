
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";

import type { RowDataPacket } from "mysql2";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import branchesRoutes from "./routes/branches.routes.js";
import merchantCustomerRoutes from "./routes/merchant-customer.routes.js";
import shipmentsRoutes from "./routes/shipments.routes.js";

import { authenticateToken } from "./middleware/auth.middleware.js";
import { requirePermission } from "./middleware/permission.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();

// ========================================
// DATABASE RESPONSE INTERFACES
// ========================================

interface ProfileRow extends RowDataPacket {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
}

interface UserRoleRow extends RowDataPacket {
    role_name: string;
}

interface UserPermissionRow extends RowDataPacket {
    permission_name: string;
}

// ========================================
// GLOBAL MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// SWAGGER DOCUMENTATION
// ========================================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api", merchantCustomerRoutes);
app.use("/api/shipments", shipmentsRoutes);

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (_req, res) => {
    res.json({
        message: "Courier Management API is running!"
    });
});

// ========================================
// DATABASE HEALTH CHECK
// ========================================

app.get("/api/health/db", async (_req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();

        return res.status(200).json({
            message: "MySQL connected successfully!"
        });

    } catch (error) {
        console.error("Database connection failed:", error);

        return res.status(500).json({
            message: "MySQL connection failed!"
        });
    }
});

// ========================================
// AUTHENTICATED USER PROFILE
// ========================================

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile, roles and permissions
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

app.get("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required"
            });
        }

        // 1. Get user information
        const [users] = await pool.execute<ProfileRow[]>(
            `SELECT user_id, full_name, email, phone
             FROM users
             WHERE user_id = ? AND is_active = TRUE`,
            [userId]
        );

        const user = users[0];

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // 2. Get assigned roles
        const [roles] = await pool.execute<UserRoleRow[]>(
            `SELECT DISTINCT r.role_name
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.role_id
             WHERE ur.user_id = ?`,
            [userId]
        );

        // 3. Get assigned permissions
        const [permissions] = await pool.execute<UserPermissionRow[]>(
            `SELECT DISTINCT p.permission_name
             FROM user_roles ur
             JOIN role_permissions rp ON ur.role_id = rp.role_id
             JOIN permissions p ON rp.permission_id = p.permission_id
             WHERE ur.user_id = ?
             ORDER BY p.permission_name`,
            [userId]
        );

        return res.status(200).json({
            message: "Profile retrieved successfully",
            user,
            roles: roles.map(role => role.role_name),
            permissions: permissions.map(
                permission => permission.permission_name
            )
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Could not fetch profile"
        });
    }
});

// ========================================
// CHECK USER PERMISSION
// ========================================

/**
 * @swagger
 * /api/auth/check-permission:
 *   get:
 *     summary: Check user permission
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permission granted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 */

app.get(
    "/api/auth/check-permission",
    authenticateToken,
    requirePermission("view_users"),
    (_req, res) => {
        res.json({
            message: "Permission granted!",
            permission: "view_users"
        });
    }
);

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
