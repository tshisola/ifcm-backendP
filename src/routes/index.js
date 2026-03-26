const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// AUTH
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

// OTP
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// ADMIN
router.post("/admin/reset-password", authController.adminResetPassword);
router.post("/admin/change-role", authController.changeRole);

// CHAT
router.post("/send-message", authController.sendMessage);
router.get("/messages", authController.getMessages);
router.post("/seen", authController.markAsSeen);

// PRESENCE
router.post("/presence", authController.addPresence);

// STATS
router.get("/stats", authController.stats);

// 🔔 PUSH NOTIFICATION (AJOUT)
router.post("/save-token", authController.savePushToken);

module.exports = router;