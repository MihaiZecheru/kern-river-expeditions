function get(id) {
  return document.getElementById(id);
}

get("register-btn").addEventListener("click", () => {
  location.href = "/register";
});

const url = "https://kern-river-expeditions-default-rtdb.firebaseio.com/";

get("login-btn").addEventListener("click", () => {
  const email = get("email").value;
  const password = get("password").value;

  fetch(`${url}/users/${email.replace(".", ",")}.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (data === null || (data && data[Object.keys(data)[0]]?.password !== password)) alert("Invalid username or password");
      else {
        window.localStorage.setItem("login_cookie", JSON.stringify(data[Object.keys(data)[0]]));
        location.href = "/";
      }
    });
});