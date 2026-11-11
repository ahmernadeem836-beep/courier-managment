
import { Router } from "express";

import {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deactivateBranch
} from "../controllers/branches.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

const router = Router();

router.use(authenticateToken);

router.get("/", requirePermission("view_branches"), getAllBranches);
router.get("/:id", requirePermission("view_branches"), getBranchById);
router.post("/", requirePermission("create_branches"), createBranch);
router.put("/:id", requirePermission("update_branches"), updateBranch);
router.patch("/:id/deactivate", requirePermission("delete_branches"), deactivateBranch);

export default router;
