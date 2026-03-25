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
// 🧪 ROUTE TEST
// =========================
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

io.on("connection", (socket) => {
  console.log("✅ User connecté");

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
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