"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
exports.authRouter = router;
const authController = new auth_1.Auth();
router.post("/login", authController.login);
