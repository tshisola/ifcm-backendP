const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "SECRET_KEY_IFCM";

// =========================
// 🔐 REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    const exist = await prisma.user.findUnique({ where: { email } });

    if (exist) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// =========================
// 🔐 LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// =========================
// 🔐 RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hash },
    });

    res.json({ message: "Mot de passe changé" });

  } catch {
    res.status(500).json({ error: "Erreur reset" });
  }
};

// =========================
// 🔐 OTP
// =========================
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpire: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log("OTP:", otp);

    res.json({ message: "OTP envoyé" });

  } catch {
    res.status(500).json({ error: "Erreur OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "OTP invalide" });
    }

    if (new Date() > user.otpExpire) {
      return res.status(400).json({ error: "OTP expiré" });
    }

    res.json({ message: "OTP valide" });

  } catch {
    res.status(500).json({ error: "Erreur OTP" });
  }
};

// =========================
// 👑 ADMIN
// =========================
exports.adminResetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  });

  res.json({ message: "Mot de passe modifié par admin" });
};

exports.changeRole = async (req, res) => {
  const { userId, role } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  res.json({ message: "Rôle mis à jour" });
};

// =========================
// 📊 PRÉSENCE (AJOUT DEMANDÉ)
// =========================
exports.addPresence = async (req, res) => {
  try {
    const { userId } = req.body;

    const presence = await prisma.presence.create({
      data: { userId },
    });

    res.json(presence);

  } catch (error) {
    res.status(500).json({ error: "Erreur présence" });
  }
};

// =========================
// 📊 STATS (AJOUT DEMANDÉ)
// =========================
exports.stats = async (req, res) => {
  try {
    const users = await prisma.user.count();
    const presence = await prisma.presence.count();

    res.json({ users, presence });

  } catch {
    res.status(500).json({ error: "Erreur stats" });
  }
};
// =========================
// 💬 ENVOYER MESSAGE
// =========================
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
  });

  res.json(message);
};

// =========================
// 📜 HISTORIQUE
// =========================
exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
};

// =========================
// 👁️ MARQUER COMME VU
// =========================
exports.markAsSeen = async (req, res) => {
  const { senderId, receiverId } = req.body;

  await prisma.message.updateMany({
    where: {
      senderId,
      receiverId,
      seen: false,
    },
    data: { seen: true },
  });

  res.json({ message: "Messages vus" });
};
// 🔔 SAVE PUSH TOKEN
exports.savePushToken = async (req, res) => {
  const { userId, token } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: { pushToken: token },
  });

  res.json({ message: "Token sauvegardé" });
};