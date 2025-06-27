async function callEmailAPI(email) {
    if (email.length === 0) {
        return false;
    }
    return true;
}

async function verifyOTP(otp) {
    return otp === "1234";
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

async function callSigninAPI(email,password) {
    const response=await fetch("http://127.0.0.1:8000/signupAPI/",{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email:email,password:password}) 
    })
    return response;
}

document.querySelector(".send").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.querySelector(".email").value.trim();
    const response = await callEmailAPI(email);
    if (response) {
        document.querySelector(".otp").disabled = false;
        document.querySelector("#verify").disabled = false;
        document.querySelector(".email").disabled = true;
        document.querySelector(".send").disabled = true;
    } else {
        customAlert("Please enter a valid email.");
    }
});

document.querySelector("#verify").addEventListener("click", async (e) => {
    e.preventDefault();
    const otp = document.querySelector(".otp").value.trim();
    const response = await verifyOTP(otp);
    if (response) {
        document.querySelector(".otp").disabled = true;
        document.querySelector("#verify").disabled = true;
        document.querySelector(".password1").disabled = false;
        document.querySelector(".password2").disabled = false;
        document.querySelector(".reset").disabled = false;
    } else {
        customAlert("Invalid OTP. Please try again.");
    }
});

document.querySelector(".reset").addEventListener("click", async (e) => {
    e.preventDefault();
    const email=document.querySelector(".email").value.trim()
    const password1 = document.querySelector(".password1").value.trim();
    const password2 = document.querySelector(".password2").value.trim();
    
    if (password1 !== password2) {
        customAlert("Password and confirm password must match!");
        return;
    }
    const response = await callSigninAPI(email,password1);
    if (response.ok) {
        window.location.href="/"
    } else {
        customAlert("Something went wrong. Please try again later.");
    }
});
