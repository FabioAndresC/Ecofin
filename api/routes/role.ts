import express from "express";
import {
    createRole,
    deleteRole,
    getAllRoles,
    updateRole,
} from "../controllers/role.controller";
import { verifyAdmin } from "../utils/verifyToken";

const router = express.Router();

// Create a new role in DB
router.post("/create", verifyAdmin, createRole);

// Update a role in DB
router.put("/update/:id", verifyAdmin, updateRole);

// Delete a role from DB
router.delete("/delete/:id", verifyAdmin, deleteRole);

// Get all roles from DB
router.get("/getAll", getAllRoles);

export default router;
