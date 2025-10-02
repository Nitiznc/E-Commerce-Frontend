const BASE_URL = "https://e-commerce-backend-production-215a.up.railway.app";

// --- TOKEN HELPERS ---
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  } catch {
    return true;
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch (err) {
    console.error("Refresh failed:", err);
    return false;
  }
}

async function authFetch(url, options = {}) {
  let token = localStorage.getItem("accessToken");
  if (isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      localStorage.clear();
      window.location.href = "auth.html";
      return;
    }
    token = localStorage.getItem("accessToken");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, options);
}

// Get all products
async function getProducts() {
  return authFetch(`${BASE_URL}/products`);
}
