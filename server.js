const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔥 HTTP SERVER (obligatoire pour socket.io)
const http = require("http");
const server = http.createServer(app);

// 🔥 SOCKET.IO
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔧 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 📦 ROUTES
const routes = require("./src/routes");
app.use("/api", routes);

// ==============================
// 💬 SOCKET.IO CHAT TEMPS RÉEL
// ==============================

io.on("connection", (socket) => {
  console.log("🔥 User connected :", socket.id);

  // 📩 recevoir message
  socket.on("sendMessage", (data) => {
    console.log("📨 Message reçu :", data);

    // envoyer à tout le monde
    io.emit("receiveMessage", data);
  });

  // 👤 rejoindre une room (important pour futur)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // 💬 envoyer message dans une room spécifique
  socket.on("sendMessageToRoom", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  // ❌ déconnexion
  socket.on("disconnect", () => {
    console.log("❌ User disconnected :", socket.id);
  });
});

// 🚀 LANCEMENT SERVEUR
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});