let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cart-items");
  let totalAmount = 0;
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    cartItems.innerHTML += `
            <tr>
                <td><img src="${item.imageUrl}" width="50"></td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},-1)">-</button>
                    ${item.quantity}
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},1)">+</button>
                </td>
                <td>₹${itemTotal}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button></td>
            </tr>
        `;
  });
  document.getElementById("total-amount").innerText = totalAmount;
}

function addToCart(id, name, price, imageUrl) {
  console.log("Adding product to cart:", id, name, price, imageUrl);

  price = parseFloat(price);
  let itemIndex = cart.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      imageUrl: imageUrl,
      quantity: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    // Count total items (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerText = totalItems;
  }
}

function changeQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCounter();
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
  }
}

// Initialize cart on page load
function initCart() {
  // Reload cart from localStorage
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Update the counter on page load
  updateCartCounter();
  // If we're on the cart page, load the cart items
  if (document.getElementById("cart-items")) {
    loadCart();
  }
}

// Run initialization when DOM is ready
document.addEventListener("DOMContentLoaded", initCart);
