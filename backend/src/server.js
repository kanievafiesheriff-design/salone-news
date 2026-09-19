
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adRoutes from "./routes/adRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/*
  MIDDLEWARE
*/

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
  HEALTH CHECK
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Salone News API is running",
    timestamp: new Date().toISOString(),
  });
});

/*
  API ROUTES
*/

app.use("/api/news", newsRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/uploads", uploadRoutes);
app.use("/api/ads", adRoutes);

/*
  404
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/*
  ERROR HANDLER
*/

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Salone News API running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start Salone News API:");
  console.error(error.message);
  process.exitCode = 1;
});
