
import { Router } from "express";
import { registerMerchantApplication } from "../controllers/merchant-application.controller.js";

const router = Router();

/**
 * @swagger
 * /api/merchant-applications:
 *   post:
 *     summary: Submit merchant registration application
 *     description: Public endpoint for merchants to submit a signup application. The account remains inactive until admin approval.
 *     tags:
 *       - Merchant Applications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - businessType
 *               - businessCategory
 *               - averageShipmentsPerDay
 *               - shippingCoverage
 *               - paymentMethod
 *               - contactPerson
 *               - email
 *               - phone
 *               - businessAddress
 *               - businessCity
 *               - returnAddress
 *               - returnCity
 *               - returnArea
 *               - returnContactPerson
 *               - returnContactNumber
 *               - password
 *             properties:
 *               businessName:
 *                 type: string
 *               businessType:
 *                 type: string
 *               businessCategory:
 *                 type: string
 *               website:
 *                 type: string
 *               socialMediaLink:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               businessDescription:
 *                 type: string
 *               averageShipmentsPerDay:
 *                 type: string
 *               averageShipmentsPerMonth:
 *                 type: string
 *               currentCourierPartner:
 *                 type: string
 *               shippingCoverage:
 *                 type: string
 *               shippingCities:
 *                 type: array
 *                 items:
 *                   type: string
 *               pickupRequired:
 *                 type: boolean
 *               pickupAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               expectedCodVolume:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               alternatePhone:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               businessCity:
 *                 type: string
 *               returnAddress:
 *                 type: string
 *               returnCity:
 *                 type: string
 *               returnArea:
 *                 type: string
 *               returnContactPerson:
 *                 type: string
 *               returnContactNumber:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Merchant application submitted successfully
 *       400:
 *         description: Invalid or missing required fields
 *       409:
 *         description: An account with this email already exists
 *       500:
 *         description: Internal server error
 */

// Public merchant signup application
router.post("/", registerMerchantApplication);

export default router;
