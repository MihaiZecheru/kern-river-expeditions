function get(id) {
  return document.getElementById(id);
}

get("read-more-btn").addEventListener("click", () => {
  window.location.hash = '#scroll-down';
});

const login_cookie = window.localStorage.getItem("login_cookie");
if (login_cookie && JSON.parse(login_cookie).isAdmin === true) {
  get("icons-list").innerHTML += `<li class="nav-item me-3 me-lg-0"><a class="nav-link" href="/admin"><i class="fas fa-lock"></i></a></li>`;
}

get("send-btn").addEventListener("click", () => {
  const firstName = get("first-name").value;
  const email = get("email").value;
  const phone = get("phone").value;
  const lastName = get("last-name").value;
  const message = get("message-body").value;

  if (!firstName || !email || !phone || !lastName || !message) {
    return alert("Please fill all the fields");
  }

  fetch(`https://kern-river-expeditions-default-rtdb.firebaseio.com/messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName,
      email,
      phone,
      lastName,
      message,
      date: Date.now()
    })
  }).then(() => {
    get("first-name").value = "";
    get("email").value = "";
    get("phone").value = "";
    get("last-name").value = "";
    get("message-body").value = "";
  })
});

// Remove #scroll-down from URL after 3 seconds
new Promise((res) => {
  setTimeout(() => {
    history.pushState(null, null, '#');
    res();
  }, 3000);
})