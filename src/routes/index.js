const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// =========================
// 🔐 AUTH
// =========================
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

// =========================
// 🔑 OTP
// =========================
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// =========================
// 👑 ADMIN
// =========================
router.post("/admin/reset-password", authController.adminResetPassword);
router.post("/admin/change-role", authController.changeRole);

// =========================
// 📍 PRESENCE + STATS
// =========================
router.post("/presence", authController.addPresence);
router.get("/stats", authController.stats);

// =========================
// 🛠️ CREATE ADMIN (TEMPORAIRE)
// =========================
router.get("/create-admin", async (req, res) => {
  const bcrypt = require("bcrypt");
  const prisma = require("../config/prisma");

  try {
    const hash = await bcrypt.hash("123456", 10);

    const user = await prisma.user.create({
      data: {
        name: "Admin IFCM",
        email: "admin@ifcm.com",
        password: hash,
        role: "ADMIN_GENERAL",
      },
    });

    res.json({ message: "Admin créé", user });

  } catch (err) {
    res.json({
      error: "Admin existe déjà ou erreur",
      details: err.message,
    });
  }
});

module.exports = router;