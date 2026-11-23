
import { Router } from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deactivateUser,
    activateUser
} from "../controllers/users.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = Router();

router.use(authenticateToken);

// ========================================
// SWAGGER TAGS
// ========================================

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

// ========================================
// GET ALL USERS
// ========================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get("/", requirePermission("view_users"), getAllUsers);

// ========================================
// GET USER BY ID
// ========================================

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 */
router.get("/:id", requirePermission("view_users"), getUserById);

// ========================================
// CREATE USER
// ========================================

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *               - role_id
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Ali Ahmed
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "03001234567"
 *               role_id:
 *                 type: integer
 *                 example: 2
 *               branch_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       409:
 *         description: Email already exists
 */
router.post("/", requirePermission("create_users"), createUser);

// ========================================
// UPDATE USER
// ========================================

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Ali Ahmed
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "03001234567"
 *               branch_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */
router.put("/:id", requirePermission("update_users"), updateUser);

// ========================================
// DEACTIVATE USER
// ========================================

/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       400:
 *         description: Invalid user ID or self-deactivation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found or already inactive
 */
router.patch(
    "/:id/deactivate",
    requirePermission("delete_users"),
    deactivateUser
);

// ========================================
// ACTIVATE USER
// ========================================

/**
 * @swagger
 * /api/users/{id}/activate:
 *   patch:
 *     summary: Activate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User activated successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: User not found
 *       409:
 *         description: User is already active
 */
router.patch(
    "/:id/activate",
    requirePermission("update_users"),
    activateUser
);

// ========================================
// EXPORT ROUTER
// ========================================

export default router;
