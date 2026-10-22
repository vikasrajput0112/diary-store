
const cart = [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartMessage = document.getElementById("cart-message");

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);
  cartItems.replaceChildren();

  if (cart.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Your bag is empty. Find a diary you love!";
    cartItems.appendChild(emptyItem);
    return;
  }

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    const itemText = document.createElement("span");
    const removeButton = document.createElement("button");

    itemText.textContent =
      `${item.name} × ${item.quantity} — ` +
      formatPrice(item.price * item.quantity);

    removeButton.type = "button";
    removeButton.className = "remove-item";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
      "aria-label",
      `Remove ${item.name} from your bag`
    );

    removeButton.addEventListener("click", () => {
      const index = cart.findIndex(
        (product) => product.name === item.name
      );

      if (index !== -1) {
        cart.splice(index, 1);
      }

      cartMessage.textContent = "";
      renderCart();
    });

    listItem.append(itemText, removeButton);
    cartItems.appendChild(listItem);
  });
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const price = Number(button.dataset.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      cartMessage.textContent = "Sorry, this product is unavailable.";
      return;
    }

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    cartMessage.textContent = `${name} added to your bag.`;
    renderCart();
  });
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    cartMessage.textContent = "Please add a diary before continuing.";
    return;
  }

  cartMessage.textContent =
    "Demo store only: checkout is not connected yet. " +
    "No order or payment has been placed.";
});

document.getElementById("newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("newsletter-message").textContent =
    "Thanks for your interest! Email subscriptions are not connected yet.";

  event.target.reset();
});

document.getElementById("year").textContent =
  new Date().getFullYear();

renderCart();
