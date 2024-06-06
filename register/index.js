function get(id) {
  return document.getElementById(id);
}

const url = "https://kern-river-expeditions-default-rtdb.firebaseio.com/";

get("register-btn").addEventListener("click", () => {
  const name = get("name").value;
  const email = get("email").value;
  const password = get("password").value;
  const repeatPassword = get("repeat-password").value; 

  if (password !== repeatPassword) return alert("passwords do not match");

  fetch(`${url}/users/${email.replace(".", ",")}.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, isAdmin: false })
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = "/login";
    });
});