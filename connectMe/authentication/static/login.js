function customAlert(msg) {
  const alt = document.querySelector("#customAlert");
  alt.classList.remove("hidden");
  alt.innerHTML = "";

  const child = document.createElement("p");
  child.textContent = msg;
  child.style.color = "white";

  alt.appendChild(child);

  setTimeout(() => {
    alt.classList.add("hidden");
    alt.innerHTML = "";
  }, 3000);
}

//for calling login API
async function callingLoginAPI(email, password) {
  const response = await fetch("http://127.0.0.1:8000/loginAPI/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  return response;
}

document.querySelector(".login").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value.trim();
  const password = document.querySelector(".password").value.trim();
  const response = await callingLoginAPI(email, password);
  if (response.ok) {
    window.location.href="/home" //redirect to home page
  } else {
    customAlert("invalid credentials ! please enter a valid login credentials..");
  }
});
