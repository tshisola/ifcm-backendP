const express = require("express");
const router = express.Router();

// 🔐 CONTROLLERS
const authController = require("../controllers/authController");

// =========================
// 🔐 AUTH ROUTES
// =========================

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

// =========================
// 🔐 OTP ROUTES
// =========================

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// =========================
// 👑 ADMIN ROUTES
// =========================

router.post("/admin/reset-password", authController.adminResetPassword);
router.post("/admin/change-role", authController.changeRole);

// =========================
// 📊 PRÉSENCE & STATS (AJOUT DEMANDÉ)
// =========================

router.post("/presence", authController.addPresence);
router.get("/stats", authController.stats);

// =========================
// 🧪 TEST ROUTE
// =========================

router.get("/", (req, res) => {
  res.json({
    message: "🚀 API IFCM PRO ACTIVE",
    status: "OK",
  });
});

// =========================

module.exports = router;