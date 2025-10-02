const BASE_URL =
  "https://e-commerce-backend-production-e267.up.railway.app/api/auth";

// token helper 

function isTokenExpired(token) {
  if(!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp * 1000;
  return Date.now() >= expiry;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if(!refreshToken) return false;
  
  try {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({refreshToken}),
    });

    if(!response.ok) return false;

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch (error) {
    console.error("Refresh failed", error);
    return false;
  }
}


async function authFetch(url, options = {}) {
  let token = localStorage.getItem("accessToken");
  if(isTokenExpired(token)) {
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
  };
  return fetch(url, options);
}


// Toggle between Login and Signup
function showLogin() {
  document.getElementById("login-form").classList.add("active");
  document.getElementById("signup-form").classList.remove("active");
  document.querySelectorAll(".auth-toggle button")[0].classList.add("active");
  document.querySelectorAll(".auth-toggle button")[1].classList.remove("active");
  hideAlert();
}

function showSignup() {
  document.getElementById("signup-form").classList.add("active");
  document.getElementById("login-form").classList.remove("active");
  document.querySelectorAll(".auth-toggle button")[1].classList.add("active");
  document.querySelectorAll(".auth-toggle button")[0].classList.remove("active");
  hideAlert();
}

// Show Alert
function showAlert(message, type) {
  const alert = document.getElementById("alert-message");
  alert.className = `alert alert-${type} show`;
  alert.textContent = message;
  setTimeout(() => hideAlert(), 3000);
}

function hideAlert() {
  const alert = document.getElementById("alert-message");
  alert.classList.remove("show");
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if(!response.ok) {
        const error = await response.json();
        console.error("Signup failed:", error);
        showAlert(error.message || "Invalid email or password!", "danger");
        return;
    }

    const data = await response.json();
    console.log("Signup success:", data);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    localStorage.setItem("currentUser", JSON.stringify({ email }));

    showAlert("Login successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    console.log("after index html");
    


  } catch (err) {
    console.error(err);
        console.error("Network error:", err);
    showAlert("Something went wrong!", "danger");
  }
}

// Handle Signup
async function handleSignup(event) {
  event.preventDefault();
  const fullName = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const termsAccepted = document.getElementById("terms").checked;


  if (password !== confirmPassword) {
    showAlert("Passwords do not match!", "danger");
    return;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        termsAccepted: termsAccepted,
      }),
    });

    if(!response.ok){
        const error = await response.json();
        showAlert(error.message || "Failed to create account", "danger");
        return;
    }

    showAlert("Account created successfully ! please login.", "success");

    setTimeout(() => {
        showLogin();
        document.getElementById("login-email").value = email;
    }, 1500);

  } catch (error) {
    console.error(error)
    showAlert("Something went wrong!", "danger");
  }

}

// Social Login (Demo)
function socialLogin(platform) {
  showAlert(`${platform} login is coming soon!`, "info");
}

// Check if user is already logged in
window.addEventListener("DOMContentLoaded", async() => {
  const currentUser = localStorage.getItem("currentUser");
  const accessToken = localStorage.getItem("accessToken");

  if (!currentUser || !accessToken) {
    return;
  }

  if(isTokenExpired(accessToken)) {
    const refreshed = await refreshAccessToken();

    if(!refreshed) {
      localStorage.clear();
      window.location.href = "auth.html";
      return;
    }
  }
  window.location.href = "index.html";

});
