const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", require("./src/routes"));

// route test
app.get("/", (req, res) => {
  res.send("🚀 API IFCM fonctionne sur Render !");
});

// =========================
// 🔥 SOCKET.IO
// =========================
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

const prisma = require("./src/config/prisma");

io.on("connection", (socket) => {
  console.log("✅ User connecté");

  // 🔐 rejoindre une room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("User rejoint room:", userId);
  });

  // 💬 message privé + sauvegarde
  socket.on("privateMessage", async ({ to, from, message }) => {
    const saved = await prisma.message.create({
      data: {
        senderId: from,
        receiverId: to,
        content: message,
      },
    });

    io.to(to).emit("receiveMessage", saved);
  });

  // =========================
  // 📞 APPEL VIDEO SIGNALING (AJOUT)
  // =========================

  // appel entrant
  socket.on("callUser", ({ to, offer, from }) => {
    io.to(to).emit("incomingCall", { from, offer });
  });

  // réponse appel
  socket.on("answerCall", ({ to, answer }) => {
    io.to(to).emit("callAccepted", { answer });
  });

  // ICE candidates
  socket.on("iceCandidate", ({ to, candidate }) => {
    io.to(to).emit("iceCandidate", candidate);
  });

  // déconnexion
  socket.on("disconnect", () => {
    console.log("❌ User déconnecté");
  });
});

// =========================
// 🚀 SERVER
// =========================
const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});