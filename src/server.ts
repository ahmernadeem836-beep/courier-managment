
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";

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

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api", merchantCustomerRoutes);
app.use("/api/shipments", shipmentsRoutes);

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Courier Management API is running!"
    });
});

// Database Health Check
app.get("/api/health/db", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();

        res.json({
            message: "MySQL connected successfully!"
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            message: "MySQL connection failed!"
        });
    }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Authentication required
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

        const [rows] = await pool.execute(
            `SELECT user_id, full_name, email, phone
             FROM users
             WHERE user_id = ? AND is_active = TRUE`,
            [userId]
        );

        return res.json({
            message: "Authenticated successfully",
            user: rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Could not fetch profile"
        });
    }
});

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
    (req, res) => {
        res.json({
            message: "Permission granted!",
            permission: "view_users"
        });
    }
);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
