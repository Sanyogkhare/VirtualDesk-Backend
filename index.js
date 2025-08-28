import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Allowed origins list
const allowedOrigins = [
  "http://localhost:5173", 
  "https://subtle-donut-ac0f7f.netlify.app",   // tera current frontend
  "https://virtualdesk-app-fa48a0.netlify.app" // pehla frontend link (extra)
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Root route - simple health check
app.get("/", (req, res) => res.send("🚀 Backend is running successfully!"));

// Test route
app.get("/api/test", (req, res) => res.json({ message: "API working fine ✅" }));

// Auth routes
app.use("/api/auth", authRoutes);

// PORT setup for Render
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Test route: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
