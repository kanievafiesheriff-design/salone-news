
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";
import News from "./model/News.js";

import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adRoutes from "./routes/adRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = (process.env.PUBLIC_SITE_URL || process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const API_ORIGIN = (process.env.API_PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, "");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function toAbsoluteUrl(value = "") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
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
    const article = await News.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!article) {
      return res.status(404).send("Article not found");
    }

    const title = escapeHtml(article.title);
    const description = escapeHtml(article.excerpt);
    const image = escapeHtml(toAbsoluteUrl(article.image) || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85");
    const articleUrl = `${CLIENT_URL}/article/${encodeURIComponent(article.slug)}`;
    const publishedTime = article.publishedAt || article.date || article.createdAt;

    res.type("html").send(`<!doctype html>
<html><head>
  <meta charset="utf-8">
  <title>${title} | SLNEWSBLOG</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${articleUrl}">
  <meta property="og:site_name" content="SLNEWSBLOG">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:type" content="article">
  <meta property="article:section" content="${escapeHtml(article.category)}">
  <meta property="article:published_time" content="${escapeHtml(publishedTime ? new Date(publishedTime).toISOString() : "")}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@slnewsblog">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${title}">
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
