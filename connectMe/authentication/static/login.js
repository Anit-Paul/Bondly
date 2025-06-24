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
  return email == "anit42655@gmail.com" && password == "1234";
}

document.querySelector(".login").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value.trim();
  const password = document.querySelector(".password").value.trim();
  const response = await callingLoginAPI(email, password);
  if (response) {
    console.log("welcome to home page"); //redirect to home page
  } else {
    customAlert("invalid credentials");
  }
});
