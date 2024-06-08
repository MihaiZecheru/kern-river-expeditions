if (!window.localStorage.getItem("login_cookie")) window.location.href = "/login";
if (!window.localStorage.getItem("cart") || JSON.parse(window.localStorage.getItem("cart"))?.length === 0) window.location.href = "/cart";

function get(id) {
  return document.getElementById(id);
}

const cartItems = JSON.parse(window.localStorage.getItem("cart"))?.filter(item => item !== null);
const email = JSON.parse(window.localStorage.getItem("login_cookie")).email;
  
function update_checkout_prices() {
  const TAX_RATE = 7.25 / 100;
  const subtotalElement = get("subtotal");
  const taxElement = get("tax");
  const totalElement = get("total");
  const subtotal = parseFloat(cartItems?.reduce((acc, item) => acc + item.people * item.pricePerPerson, 0) || 0.00).toFixed(2);
  const tax = parseFloat(subtotal * TAX_RATE).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
  subtotalElement.textContent = `$${subtotal}`;
  taxElement.textContent = `$${tax}`;
  totalElement.textContent = `$${total}`;
  const discount_amount = parseFloat(cartItems?.reduce((acc, item) => acc + item.people * item.pricePerPerson * cartItems[0].discount / 100, 0) || 0.00).toFixed(2);
  get("discount").textContent = `- $${discount_amount}`;
  if (discount_amount !== "0.00") {
    get("discount-parent").classList.remove("visually-hidden");
  } else {
    get("discount-parent").classList.add("visually-hidden");
  }
  get("total").textContent = `$${(parseFloat(total) - parseFloat(discount_amount)).toFixed(2)}`;
}

const payNowBtn = get("pay-now-btn");
update_checkout_prices();

payNowBtn.addEventListener("click", () => {
  if (!window.localStorage.getItem("saved-card")) {
    new mdb.Modal(get("card-not-saved-modal")).show();
    payNowBtn.classList.remove("disabled");
    payNowBtn.innerHTML = "Pay Now";
    return;
  }

  payNowBtn.innerHTML = `
  <div class="spinner-border text-light spinner-border-sm" role="status">
    <span class="visually-hidden">Processing Payment...</span>
  </div><div style="margin-left: .5rem!important"><span>Processing Payment</span></div>`;
  payNowBtn.classList.add("disabled");

  setTimeout(() => {
    const order = {
      email,
      order_id: Math.floor(Math.random() * 1000000000).toString(),
      items: cartItems,
      total: parseFloat(get("total").textContent.replace("$", "")),
      date: Date.now()
    };
    fetch("https://kern-river-expeditions-default-rtdb.firebaseio.com/orders.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    }).then(res => {
      if (res.status === 200) {
        window.localStorage.removeItem("cart");
        window.localStorage.removeItem("saved-card");
        window.localStorage.setItem("confirmationNumber", order.order_id);
        window.location.href = "/confirmation";
      }
    });
  }, 2000);
});

get("email-info").innerText = email;

function validateCard(nameOnCard, cardNumber, expiration, cvv) {
  return nameOnCard.length > 0 && cardNumber.length === 16 && expiration.length === 5 && cvv.length === 3;
}

get("save-card-btn").addEventListener("click", () => {
  if (!validateCard(get("name-on-card").value, get("credit-card-number").value, get("expiration").value, get("cvv").value)) {
    new mdb.Modal(get("invalid-card-modal")).show();
    return;
  }
  new mdb.Animate(payNowBtn).startAnimation();
  get("save-card-btn").innerHTML = `
  <div class="spinner-border text-light spinner-border-sm" role="status">
    <span class="visually-hidden">Saving Card...</span>
  </div><div style="margin-left: .5rem!important"><span>Saving Card</span></div>`;
  get("save-card-btn").disabled = true;
  get("name-on-card").disabled = true;
  get("credit-card-number").disabled = true;
  get("expiration").disabled = true;
  get("cvv").disabled = true;
  setTimeout(() => {
    window.localStorage.setItem("saved-card", true);
    new mdb.Alert(get("alert-success")).show();
    get("save-card-btn").innerHTML = "Save Card";
    get("save-card-btn").disabled = false;
  }, 1500);
});

if (cartItems?.some(item => item.discount)) {
  get("discount-parent").classList.remove("visually-hidden");
} else {
  get("discount-parent").classList.add("visually-hidden");
}