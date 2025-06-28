let otp = "";
async function callEmailAPI(email) {
  const response = await fetch("http://127.0.0.1:8000/otpAPI/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email,check:true }),
  });
  data = await response.json();
  if (response.ok) {
    otp = data.otp;
    return [true, data.message];
  }
  return [false, data.message];
}

function verifyOTP(data) {
  return otp == data;
}

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

async function callSigninAPI() {
  return true;
}

document.querySelector(".send").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value.trim();
  const [response, msg] = await callEmailAPI(email);
  if (response) {
    document.querySelector(".otp").disabled = false;
    document.querySelector("#verify").disabled = false;
    document.querySelector(".email").disabled = true;
    document.querySelector(".send").disabled = true;
  } else {
    customAlert(msg);
  }
});

document.querySelector("#verify").addEventListener("click", async (e) => {
  e.preventDefault();
  const response = verifyOTP(document.querySelector(".otp").value.trim());
  if (response) {
    document.querySelector(".otp").disabled = true;
    document.querySelector("#verify").disabled = true;
    document.querySelector(".password1").disabled = false;
    document.querySelector(".password2").disabled = false;
    document.querySelector(".signin").disabled = false;
  }
});

document.querySelector(".signin").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value.trim();
  password1 = document.querySelector(".password1").value.trim();
  password2 = document.querySelector(".password2").value.trim();
  if (password1 != password2) {
    customAlert("password and the confirmed must be same!");
    return;
  }
  const response = await callSigninAPI();
  if (response) {
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password1);
    window.location.href = "/accountsetup";
  } else {
    customAlert("something went wrong please try after some time!");
  }
});
