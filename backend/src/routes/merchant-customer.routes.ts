
import { Router } from "express";

import {
    getAllMerchants,
    getMerchantById,
    createMerchant,
    updateMerchant,
    deactivateMerchant,
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deactivateCustomer
} from "../controllers/merchant-customer.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = Router();

router.use(authenticateToken);

// Merchant APIs
router.get("/merchants", requirePermission("view_merchants"), getAllMerchants);
router.get("/merchants/:id", requirePermission("view_merchants"), getMerchantById);
router.post("/merchants", requirePermission("create_merchants"), createMerchant);
router.put("/merchants/:id", requirePermission("update_merchants"), updateMerchant);
router.patch("/merchants/:id/deactivate", requirePermission("delete_merchants"), deactivateMerchant);

// Customer APIs
router.get("/customers", requirePermission("view_customers"), getAllCustomers);
router.get("/customers/:id", requirePermission("view_customers"), getCustomerById);
router.post("/customers", requirePermission("create_customers"), createCustomer);
router.put("/customers/:id", requirePermission("update_customers"), updateCustomer);
router.patch("/customers/:id/deactivate", requirePermission("delete_customers"), deactivateCustomer);

export default router;
