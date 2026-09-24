
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";
import News from "./model/News.js";
import mongoose from "mongoose";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adRoutes from "./routes/adRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = (process.env.PUBLIC_SITE_URL || process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

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
    message: "SLNEWSBLOG API is running",
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

// Social crawlers read this HTML without running the React application.
app.get("/share/:slug", async (req, res) => {
  try {
    const articleLookup = mongoose.isValidObjectId(req.params.slug)
      ? { _id: req.params.slug }
      : { slug: req.params.slug };
    const article = await News.findOne({ ...articleLookup, published: true }).lean();

    if (!article) {
      return res.status(404).send("Article not found");
    }

    const title = escapeHtml(article.title);
    const description = escapeHtml(article.excerpt);
    const image = escapeHtml(article.image || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85");
    const articleUrl = `${CLIENT_URL}/article/${encodeURIComponent(article.slug)}`;
    const shareUrl = `${req.protocol}://${req.get("host")}/share/${encodeURIComponent(article.slug)}`;

    res.type("html").send(`<!doctype html>
<html><head>
  <meta charset="utf-8">
  <title>${title} | SLNEWSBLOG</title>
  <meta name="description" content="${description}">
  <meta name="author" content="SLNEWSBLOG">
  <link rel="canonical" href="${articleUrl}">
  <meta property="og:site_name" content="SLNEWSBLOG">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${title}">
  <meta name="twitter:url" content="${shareUrl}">
</head><body>
  <script>window.location.replace(${JSON.stringify(articleUrl)})</script>
</body></html>`);
  } catch (error) {
    console.error("Failed to render social share preview:", error);
    res.status(500).send("Failed to render share preview");
  }
});

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
      `SLNEWSBLOG API running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start SLNEWSBLOG API:");
  console.error(error.message);
  process.exitCode = 1;
});
