
import { Router } from "express";

import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    getAllPermissions,
    getRolePermissions,
    assignPermissionsToRole
} from "../controllers/roles.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = Router();

router.use(authenticateToken);

// Role routes
router.get("/", requirePermission("manage_roles"), getAllRoles);
router.get("/permissions/all", requirePermission("manage_permissions"), getAllPermissions);
router.get("/:id/permissions", requirePermission("manage_permissions"), getRolePermissions);
router.post("/:id/permissions", requirePermission("manage_permissions"), assignPermissionsToRole);
router.get("/:id", requirePermission("manage_roles"), getRoleById);
router.post("/", requirePermission("manage_roles"), createRole);
router.put("/:id", requirePermission("manage_roles"), updateRole);

export default router;
