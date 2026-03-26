const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =========================
// 🔧 MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// 🛣️ ROUTES API
// =========================
app.use("/api", require("./src/routes"));

// =========================
// 🔥 SOCKET.IO PRIVÉ
// =========================
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("✅ User connecté");

  // 🔐 rejoindre une room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("User rejoint room:", userId);
  });

  // 💬 message privé
  socket.on("privateMessage", ({ to, message }) => {
    io.to(to).emit("receiveMessage", message);
  });

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