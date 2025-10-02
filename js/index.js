// Check if user is logged in
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const accessToken = localStorage.getItem("accessToken");

  if (!currentUser || !accessToken) {
    window.location.href = "auth.html";
  } else {
    loadProducts();
  }
});

// Load and render products
async function loadProducts() {
  try {
    const response = await getProducts(); // <- uses api.js

    if (!response.ok) throw new Error("Failed to load products");

    const products = await response.json();
    console.log(products);

    const trendingList = document.getElementById("trending-products");
    const clothingList = document.getElementById("clothing-products");
    const electronicsList = document.getElementById("electronics-products");

    trendingList.innerHTML = "";
    clothingList.innerHTML = "";
    electronicsList.innerHTML = "";

    products.forEach((product) => {
      const productCard = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="price"><strong>₹${product.price}</strong></p>
              <button class="btn btn-primary mt-auto"
                onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.imageUrl}')">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;

      if (product.category === "Clothing") {
        clothingList.innerHTML += productCard;
      } else if (product.category === "Electronics") {
        electronicsList.innerHTML += productCard;
      } else {
        trendingList.innerHTML += productCard;
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    localStorage.clear();
    window.location.href = "auth.html";
  }
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "auth.html";
}
