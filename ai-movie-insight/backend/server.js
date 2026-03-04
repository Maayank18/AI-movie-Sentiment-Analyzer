import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// ─────────────────────────────────────────────
// Load environment variables
// ─────────────────────────────────────────────
dotenv.config();

// const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "https://ai-movie-sentiment-analyzer.vercel.app"] 
}));
app.use(express.json());

// ─────────────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use("/api/movie", movieRoutes);

// ─────────────────────────────────────────────
// Error Handling Middleware (always last)
// ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────
// Connect DB then Start Server
// ─────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
  });
});

export default app;