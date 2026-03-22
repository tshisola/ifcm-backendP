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
// 🚀 SERVER
// =========================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});