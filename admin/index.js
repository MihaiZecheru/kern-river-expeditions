const LOAD_DELAY = 1;
// const LOAD_DELAY = 1500;

if (!JSON.parse(window.localStorage.getItem("login_cookie"))?.isAdmin) window.location.href = "/";

const sidenav = document.getElementById("sidenav");

function showSidenav() {
  document.getElementById("on-load-spinner").parentElement.remove();
  mdb.Sidenav.getOrCreateInstance(sidenav).show();
  sidenav.classList.remove("visually-hidden");
}

function addMessageToSidenav(message) {
  document.querySelector("[data-messages-group]").innerHTML += `
    <li class="sidenav-item">
      <a type="button" class="sidenav-link messages-link"><span class="larger-text">${message.firstName} ${message.lastName}  <i class="fas fa-arrow-right"></i></span></a>
    </li>`;
}

function addOrderToSidenav(order) {
  document.querySelector("[data-orders-group]").innerHTML += `
    <li class="sidenav-item">
      <a type="button" class="sidenav-link orders-link"><span class="larger-text">${order.order_id}  <i class="fas fa-arrow-right"></i></span></a>
    </li>`;
}

function addUserToSidenav(user) {
  document.querySelector("[data-users-group]").innerHTML += `
    <li class="sidenav-item">
      <a type="button" class="sidenav-link users-link"><span class="larger-text">${user.email}  <i class="fas fa-arrow-right"></i></span></a>
    </li>`;
}

function addPromoCodeToSideNav(promoCode) {
  document.querySelector("[data-promo-codes-group]").innerHTML += `
    <li class="sidenav-item">
      <a type="button" class="sidenav-link promo-code-link"><span class="larger-text">${promoCode.code}  <i class="fas fa-arrow-right"></i></span></a>
    </li>`;
}

function prepSidenav(messages, orders, users, promoCodes) {
  messages.forEach(message => addMessageToSidenav(message));
  orders.forEach(order => addOrderToSidenav(order));
  users.forEach(user => addUserToSidenav(user));
  promoCodes.forEach(promoCode => addPromoCodeToSideNav(promoCode));
}

async function getMessages() {
  return await fetch(`https://kern-river-expeditions-default-rtdb.firebaseio.com/messages.json`).then(res => res.json()).then(data => Object.values(data));
}

async function getOrders() {
  return await fetch(`https://kern-river-expeditions-default-rtdb.firebaseio.com/orders.json`).then(res => res.json()).then(data => Object.values(data));
}

async function getUsers() {
  return await fetch(`https://kern-river-expeditions-default-rtdb.firebaseio.com/users.json`).then(res => res.json()).then(data => Object.values(Object.values(data)).map(userObj => userObj[Object.keys(userObj)[0]]));
}

async function main() {
  const messages = await getMessages();
  const orders = await getOrders();
  const users = await getUsers();
  const promoCodes = await fetch(`https://kern-river-expeditions-default-rtdb.firebaseio.com/promo-codes.json`).then(res => res.json()).then(data => Object.values(data));
  window.localStorage.setItem("messages", JSON.stringify(messages));
  window.localStorage.setItem("orders", JSON.stringify(orders));
  window.localStorage.setItem("users", JSON.stringify(users));
  window.localStorage.setItem("promoCodes", JSON.stringify(promoCodes));
  showSidenav();
  prepSidenav(messages, orders, users, promoCodes);
  setMessageGroupEventListeners(document.querySelectorAll(".messages-link"));
  setOrderGroupEventListeners(document.querySelectorAll(".orders-link"));
  setUserGroupEventListeners(document.querySelectorAll(".users-link"));
  setPromoCodeGroupEventListeners(document.querySelectorAll(".promo-code-link"));
}

function setMessageGroupEventListeners(messageElements) {
  messageElements.forEach(messageElement => {
    messageElement.addEventListener("click", () => {
      const messageIndex = Array.from(document.querySelectorAll(".messages-link")).indexOf(messageElement);
      const message = JSON.parse(window.localStorage.getItem("messages"))[messageIndex];
      document.querySelector("#content").innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col">
              <h1 class="text-center">Message</h1>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${message.firstName} ${message.lastName}</h5>
                  <div class="mb-2 w-100 d-flex justify-content-between">
                    <h6 class="card-subtitle text-muted">${message.email}</h6>
                    <h6 class="card-subtitle text-muted">${new Date(message.date).toLocaleDateString()} - ${new Date(message.date).toLocaleTimeString()}</h6>
                  </div>
                  <h6 class="card-subtitle mb-4 text-muted">${message.phone}</h6>
                  <p class="card-text">${message.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
}

function setOrderGroupEventListeners(orderElements) {
  orderElements.forEach(orderElement => {
    orderElement.addEventListener("click", () => {
      const orderIndex = Array.from(document.querySelectorAll(".orders-link")).indexOf(orderElement);
      const order = JSON.parse(window.localStorage.getItem("orders"))[orderIndex];
      document.querySelector("#content").innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col">
              <h1 class="text-center">Order</h1>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Order ID: ${order.order_id}</h5>
                  <div class="mb-2 w-100 d-flex justify-content-between">
                    <h6 class="card-subtitle text-muted">${order.email}</h6>
                    <h6 class="card-subtitle text-muted">${new Date(order.date).toLocaleDateString()} - ${new Date(order.date).toLocaleTimeString()}</h6>
                  </div>
                  <h6 class="card-subtitle mb-4 text-success">+ $${order.total}</h6>
                  <p class="card-text">
                    ${order.items.reduce((acc, item) => acc + `${item.name} - $${item.pricePerPerson} x ${item.people}<br>`, "")}
                    ${order.items[0].discount ? '<br>' : ''}
                    <span class="text-danger">${order.items[0].discount ? `%${order.items[0].discount} discount applied\n` : ""}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
}

function setUserGroupEventListeners(userElements) {
  userElements.forEach(userElement => {
    userElement.addEventListener("click", () => {
      const userIndex = Array.from(document.querySelectorAll(".users-link")).indexOf(userElement);
      const user = JSON.parse(window.localStorage.getItem("users"))[userIndex];
      document.querySelector("#content").innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col">
              <h1 class="text-center">User</h1>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${user.email}</h5>
                  <div class="mb-2 w-100 d-flex justify-content-between">
                    <h6 class="card-subtitle text-muted">${user.name}</h6>
                    <h5 class="card-subtitle">${user.isAdmin ? '<span class="text-danger">Admin</span>' : '<span class="text-success">User</span>'}</h5>
                  </div>
                  <button type="button" class="btn btn-danger m5-3">Delete User</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
}

function setPromoCodeGroupEventListeners(promoCodeElements) {
  promoCodeElements.forEach(promoCodeElement => {
    promoCodeElement.addEventListener("click", () => {
      const promoCodeIndex = Array.from(document.querySelectorAll(".promo-code-link")).indexOf(promoCodeElement);
      const promoCode = JSON.parse(window.localStorage.getItem("promoCodes"))[promoCodeIndex];
      document.querySelector("#content").innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col">
              <h1 class="text-center">Promo Code</h1>
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${promoCode.code}</h5>
                  <div class="mb-2 w-100 d-flex justify-content-between">
                    <h6 class="card-subtitle text-danger">${promoCode.discount}% off</h6>
                    <h6 class="card-subtitle text-muted">${new Date(promoCode.date).toLocaleDateString()} - ${new Date(promoCode.date).toLocaleTimeString()}</h6>
                  </div>
                  <p class="card-text">${promoCode.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
}

setTimeout(main, LOAD_DELAY);
