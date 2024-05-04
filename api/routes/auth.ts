import express from "express";
import { login, register, registerAdmin } from "../controllers/auth.controller";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login)

// Reg as admin
router.post("/register-admin", registerAdmin)

export default router;
