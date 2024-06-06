// if user not logged in
if (!window.localStorage.getItem("login_cookie")) window.location.href = "/login";

function get(id) {
  return document.getElementById(id);
}

const login_cookie = window.localStorage.getItem("login_cookie");
if (login_cookie && JSON.parse(login_cookie).isAdmin === true) {
  get("icons-list").innerHTML += `<li class="nav-item me-3 me-lg-0"><a class="nav-link" href="/admin"><i class="fas fa-lock"></i></a></li>`;
}

function generateCartItem(id, img, people, name, pricePerPerson, date, time, discount, maxPeople) {
  const price = people * pricePerPerson;
  const discount_price = parseFloat(price * (100 - discount) / 100).toFixed(2);
  return `<!-- Single item -->
  <div class="row border-bottom mb-4 cart-item">
    <div class="col-md-2 mb-4 mb-md-0">
      <div class="bg-image rounded-5 mb-4 overflow-hidden d-block" data-mdb-ripple-init data-ripple-color="light">
        <img src="${img}" class="w-100" alt="" />
        <div class="hover-overlay" style="cursor: pointer!important">
          <div class="mask" style="background-color: hsla(0, 0%, 98.4%, 0.2)"></div>
        </div>
      </div>
    </div>

    <div class="col-md-8 mb-4 mb-md-0">
      <p class="fw-bold">${name}</p>
      <p class="mb-1">
        <span class="text-muted me-2">Price per person: </span><span>${pricePerPerson}</span>
      </p>
      <p>
        <span class="text-muted me-2">When: </span><span>${date}, ${time}</span>
      </p>

      <p class="mb-4">
        <a id="remove-${id}" href="" class="text-muted pe-3 border-end"><small><i class="fas fa-trash me-2"></i>Remove</small></a>
      </p>
    </div>

    <div class="col-md-2 mb-4 mb-md-0">
      <div class="form-outline mb-4" data-mdb-input-init>
        <input type="number" id="people-${id}" class="form-control" value="${people}" min="1" max="${maxPeople}" />
        <label class="form-label" for="people-${id}">People</label>
        </div>
        <h5 class="mb-2">
          ${
            discount === 0 ? `<span class="align-middle">$${price}</span>` : `<s class="text-muted me-2 small align-middle">$${price}</s><span class="align-middle">$${discount_price}</span>`
          }
        </h5>
        ${
          discount === 0 ? '' : `<p class="text-danger"><small>You save ${discount}%</small></p>`
        }
    </div>
  </div>
  <!-- Single item -->`;
}

const cartItems = JSON.parse(window.localStorage.getItem("cart")).filter(item => item !== null);
get("cart-body").innerHTML = mapCartItemsToHTML(cartItems);

function mapCartItemsToHTML(cartItems) {
  if (!cartItems) return `<h1 class="text-center">Cart is empty</h1>`;

  let html = "";
  cartItems.forEach(item => {
    html += generateCartItem(item.id, item.img, item.people, item.name, item.pricePerPerson, item.date, item.time, item.discount, item.maxPeople);
  });

  return html;
}

function update_checkout_prices() {
  const TAX_RATE = 7.25 / 100;
    const subtotalElement = get("subtotal");
    const taxElement = get("tax");
    const totalElement = get("total");
    const subtotal = parseFloat(cartItems.reduce((acc, item) => acc + item.people * item.pricePerPerson, 0) || 0.00).toFixed(2);
    const tax = parseFloat(subtotal * TAX_RATE).toFixed(2);
    const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
    subtotalElement.textContent = `$${subtotal}`;
    taxElement.textContent = `$${tax}`;
    totalElement.textContent = `$${total}`;
}

function activate_inputs() {
  document.querySelectorAll('.cart-item').forEach((cartItemElement, index) => {
    const input = cartItemElement.querySelector('input');
    new mdb.Input(input.parentElement);

    input.addEventListener('change', (e) => {
      cartItems[index].people = parseInt(e.target.value);
      window.localStorage.setItem("cart", JSON.stringify(cartItems));
      cartItemElement.querySelector('h5').innerHTML = `$${cartItems[index].people * cartItems[index].pricePerPerson}`;
      console.log(cartItems[index].discount);
      if (cartItems[index].discount != 0) {
        const price = cartItems[index].people * cartItems[index].pricePerPerson;
        const discount_price = parseFloat(price * (100 - cartItems[index].discount) / 100).toFixed(2);
        cartItemElement.querySelector('h5').innerHTML = `<s class="text-muted me-2 small align-middle">$${price}</s><span class="align-middle">$${discount_price}</span>`;
        cartItemElement.querySelector('p.text-danger').innerHTML = `<small>You save ${cartItems[index].discount}%</small>`;
      }
      update_checkout_prices();
    });

    const removeBtn = cartItemElement.querySelector(`#remove-${cartItems[index].id}`);
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartItems.splice(index, 1);
      if (cartItems.length !== 0) {
        get("cart-body").innerHTML = '<h1 class="text-center">Cart is empty</h1';
        window.localStorage.setItem("cart", JSON.stringify(cartItems));
      } else
        window.localStorage.removeItem("cart");
      get("cart-body").innerHTML = mapCartItemsToHTML(cartItems);
      activate_inputs();
    });
  });
}

activate_inputs();
update_checkout_prices();
const promoBox = get("promo-box");
const applyBtn = get("apply-btn");

applyBtn.addEventListener('click', async () => {
  const promoCode = promoBox.value.toUpperCase();
  if (promoCode === "") return;
  const promoCodes = await fetch("https://kern-river-expeditions-default-rtdb.firebaseio.com/promo-codes.json").then(res => res.json());
  const promoCodeObj = promoCodes.find(code => code.code === promoCode);
  if (!promoCodeObj) {
    promoBox.value = "";
    document.getElementById("error-promo-code").textContent = promoCode;
    return new mdb.Modal(document.getElementById("promo-error-modal")).show();
  }
  const discount = promoCodeObj.discount;
  for (let i = 0; i < cartItems.length; i++) {
    cartItems[i].discount = discount;
  }
  window.localStorage.setItem("cart", JSON.stringify(cartItems));
  get("cart-body").innerHTML = mapCartItemsToHTML(cartItems);
  activate_inputs();
  document.getElementById("promo-success-modal-text").textContent = `Nice! You saved ${discount}% on your booking!`;
  new mdb.Modal(document.getElementById("promo-success-modal")).show();
});

get("add-btn").addEventListener('click', () => {
  window.location.href = "/#scroll-down";
});

setInterval(() => {
  if (cartItems === null || cartItems.length === 0)
    get("checkout-btn").classList.add("disabled");
  else
    get("checkout-btn").classList.remove("disabled");
}, 200);