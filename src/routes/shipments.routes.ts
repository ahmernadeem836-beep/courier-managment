
import { Router } from "express";

import {
    createShipment,
    getAllShipments,
    getShipmentByTrackingNumber,
    updateShipmentStatus
} from "../controllers/shipments.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Shipment booking and tracking APIs
 */

/**
 * @swagger
 * /api/shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchant_id
 *               - customer_id
 *               - origin_branch_id
 *               - destination_branch_id
 *               - weight
 *             properties:
 *               merchant_id:
 *                 type: integer
 *                 example: 2
 *               customer_id:
 *                 type: integer
 *                 example: 2
 *               origin_branch_id:
 *                 type: integer
 *                 example: 1
 *               destination_branch_id:
 *                 type: integer
 *                 example: 1
 *               parcel_description:
 *                 type: string
 *                 example: Electronics Package
 *               weight:
 *                 type: number
 *                 example: 2.5
 *               cod_amount:
 *                 type: number
 *                 example: 5000
 *               shipping_charges:
 *                 type: number
 *                 example: 200
 *               expected_delivery_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-11-15"
 *     responses:
 *       201:
 *         description: Shipment booked successfully
 *       400:
 *         description: Invalid or missing fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.use(authenticateToken);

/**
 * @swagger
 * /api/shipments:
 *   get:
 *     summary: Get all shipments with filters and pagination
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter shipments by status
 *       - in: query
 *         name: tracking_number
 *         schema:
 *           type: string
 *         description: Search by tracking number
 *       - in: query
 *         name: merchant_id
 *         schema:
 *           type: integer
 *         description: Filter by merchant ID
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: integer
 *         description: Filter by customer ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Records per page (maximum 100)
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Permission denied
 */
router.get("/", requirePermission("view_shipments"), getAllShipments);

router.get("/", requirePermission("view_shipments"), getAllShipments);
router.post(
    "/",
    requirePermission("create_shipments"),
    createShipment
);

/**
 * @swagger
 * /api/shipments/tracking/{trackingNumber}:
 *   get:
 *     summary: Track shipment using tracking number
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: TRK123456
 *     responses:
 *       200:
 *         description: Shipment and tracking history
 *       404:
 *         description: Shipment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 */
router.get(
    "/tracking/:trackingNumber",
    requirePermission("view_shipments"),
    getShipmentByTrackingNumber
);

/**
 * @swagger
 * /api/shipments/{id}/status:
 *   patch:
 *     summary: Update shipment status
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: picked_up
 *               location:
 *                 type: string
 *                 example: Lahore Main Branch
 *               remarks:
 *                 type: string
 *                 example: Parcel collected from merchant
 *     responses:
 *       200:
 *         description: Shipment status updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Shipment not found
 */
router.patch(
    "/:id/status",
    requirePermission("update_shipments"),
    updateShipmentStatus
);

export default router;
