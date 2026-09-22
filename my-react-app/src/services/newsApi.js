const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Generic API request helper
 */
async function request(endpoint, options = {}) {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const finalUrl = `${baseUrl}${cleanEndpoint}`;

  console.log(`Calling API: ${finalUrl}`);

  const response = await fetch(finalUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });


  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
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
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return request(
    `/news${queryString ? `?${queryString}` : ""}`
  );
}

/**
 * Get one article by ID
 */
export async function getArticle(id) {
  return request(`/news/${id}`);
}

/**
 * Get one article by slug
 */
export async function getArticleBySlug(slug) {
  return request(`/news/slug/${slug}`);
}

/**
 * Search news
 */
export async function searchNews(search) {
  return getNews({
    search,
  });
}

/**
 * Get news by category
 */
export async function getNewsByCategory(category) {
  return getNews({
    category,
  });
}

/**
 * Get featured news
 */
export async function getFeaturedNews(limit = 4) {
  return getNews({
    featured: true,
    limit,
  });
}

/**
 * Get trending news
 */
export async function getTrendingNews(limit = 6) {
  return getNews({
    trending: true,
    limit,
  });
}

/**
 * Get popular news
 *
 * Currently uses the backend news endpoint.
 * Sorting by views can be implemented on the backend.
 */
export async function getPopularNews(limit = 6) {
  return getNews({
    sort: "views",
    limit,
  });
}

export async function loginAdmin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getBreakingNews() {
  return request('/news/breaking');
}

export async function setBreakingNews(text) {
  return adminRequest('/news/breaking', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function getAds(slot = null) {
  const query = slot ? `?slot=${slot}` : '';
  return request(`/ads${query}`);
}

export async function getAdminNews(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });

  const token = localStorage.getItem('salone_token');
  return request(`/news/admin${query.toString() ? `?${query}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem('salone_token');
  return request(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export function createAdminNews(article) {
  return adminRequest('/news', {
    method: 'POST',
    body: JSON.stringify(article),
  });
}

export function updateAdminNews(id, changes) {
  return adminRequest(`/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  });
}

export function deleteAdminNews(id) {
  return adminRequest(`/news/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadAdminImage(file) {
  const body = new FormData();
  body.append('image', file);
  const token = localStorage.getItem('salone_token');
  const response = await fetch(`${API_URL}/uploads/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Image upload failed');
  return data;
}

export async function uploadAdminVideo(file) {
  const body = new FormData();
  body.append('video', file);
  const token = localStorage.getItem('salone_token');
  const response = await fetch(`${API_URL}/uploads/video`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Video upload failed');
  return data;
}

export async function uploadAdminAudio(file) {
  const body = new FormData();
  body.append('audio', file);
  const token = localStorage.getItem('salone_token');
  const response = await fetch(`${API_URL}/uploads/audio`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Audio upload failed');
  return data;
}

// ... (rest of the file before line 246)
export async function sendContactMessage(messageData) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

export async function getSettings() {
  return request('/settings');
}

export async function updateSetting(key, value) {
  return adminRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify({ key, value }),
  });
}
