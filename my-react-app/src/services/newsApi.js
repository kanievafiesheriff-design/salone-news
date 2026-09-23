const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Warn loudly in production if the env var is missing — this is the #1
// cause of "site shows old data / wrong images" on the deployed site.
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    "VITE_API_URL is not set! All API calls will go to http://localhost:5000/api and fail. " +
    "Set VITE_API_URL in your Render dashboard and redeploy."
  );
}

/**
 * Generic API request helper
 */
async function request(endpoint, options = {}) {
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const finalUrl = `${baseUrl}${cleanEndpoint}`;

  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Automatically resolve relative paths to absolute URLs.
  // This ensures images/videos/audios load from the backend server, not the frontend.
  if (data && typeof data === "object") {
    const rootUrl = baseUrl.replace(/\/api$/, ""); // strip trailing /api

    const resolvePaths = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(resolvePaths);
      }
      if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => {
            if (
              typeof value === "string" &&
              /^\/(uploads|images)\//.test(value)
            ) {
              return [key, `${rootUrl}${value}`];
            }
            return [key, resolvePaths(value)];
          })
        );
      }
      return obj;
    };

    data = resolvePaths(data);
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

/**
 * Get all news
 *
 * Examples:
 * getNews()
 * getNews({ category: "Politics" })
 * getNews({ search: "Sierra Leone" })
 * getNews({ featured: true })
 */
export async function getNews(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return request(`/news${queryString ? `?${queryString}` : ""}`);
}

/**
 * Get one article by ID.
 * Handles both backend styles: { data: article } or plain article.
 */
export async function getArticle(id) {
  const response = await request(`/news/${id}`);
  return response?.data ?? response;
}

/**
 * Get one article by slug
 */
export async function getArticleBySlug(slug) {
  const response = await request(`/news/slug/${slug}`);
  return response?.data ?? response;
}

/**
 * Search news
 */
export async function searchNews(search) {
  return getNews({ search });
}

/**
 * Get news by category
 */
export async function getNewsByCategory(category) {
  return getNews({ category });
}

/**
 * Get featured news
 */
export async function getFeaturedNews(limit = 4) {
  return getNews({ featured: true, limit });
}

/**
 * Get trending news
 */
export async function getTrendingNews(limit = 6) {
  return getNews({ trending: true, limit });
}

/**
 * Get popular news (sorted by views — requires backend support for sort=views)
 */
export async function getPopularNews(limit = 6) {
  return getNews({ sort: "views", limit });
}

function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem("salone_token");
  return request(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export async function loginAdmin(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getBreakingNews() {
  return request("/news/breaking");
}

export async function setBreakingNews(text) {
  return adminRequest("/news/breaking", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function getAds(slot = null) {
  const query = slot ? `?slot=${slot}` : "";
  return request(`/ads${query}`);
}

export async function getAdminNews(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      query.append(key, value);
  });

  return adminRequest(`/news/admin${query.toString() ? `?${query}` : ""}`);
}

export function createAdminNews(article) {
  return adminRequest("/news", {
    method: "POST",
    body: JSON.stringify(article),
  });
}

export function updateAdminNews(id, changes) {
  return adminRequest(`/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

export function deleteAdminNews(id) {
  return adminRequest(`/news/${id}`, {
    method: "DELETE",
  });
}

export async function uploadAdminImage(file) {
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", "ml_default"); // Must exist as an UNSIGNED preset in Cloudinary

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/duvickzu3/image/upload`,
    { method: "POST", body }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return { imageUrl: data.secure_url };
}

export async function uploadAdminVideo(file) {
  const body = new FormData();
  body.append("video", file);
  const token = localStorage.getItem("salone_token");
  const response = await fetch(`${API_URL}/uploads/video`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Video upload failed");
  return data;
}

export async function uploadAdminAudio(file) {
  const body = new FormData();
  body.append("audio", file);
  const token = localStorage.getItem("salone_token");
  const response = await fetch(`${API_URL}/uploads/audio`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Audio upload failed");
  return data;
}

export async function sendContactMessage(messageData) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(messageData),
  });
}

export async function getSettings() {
  return request("/settings");
}

export async function updateSetting(key, value) {
  return adminRequest("/settings", {
    method: "PUT",
    body: JSON.stringify({ key, value }),
  });
}