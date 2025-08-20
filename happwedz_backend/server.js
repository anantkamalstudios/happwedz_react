require("dotenv").config();
const express = require("express");
const app = express();

// DB connection
const sequelize = require("./src/config/database");

// Test DB connection
sequelize.authenticate()
    .then(() => console.log("✅ Database connected"))
    .catch(err => console.error("❌ DB Connection error:", err));

// Sync models (optional: use { alter: true } for dev mode)
sequelize.sync()
    .then(() => console.log("✅ Models synchronized"))
    .catch(err => console.error("❌ Model sync error:", err));

app.use(express.json());

// Import routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/happy_wedz/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
