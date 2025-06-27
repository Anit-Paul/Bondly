async function callSigninUpAPI(formData){
    const response=await fetch("http://127.0.0.1:8000/signupAPI/",{
        method:'POST',
        body:formData
    })
    return response
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



const imgUploadDiv = document.querySelector(".img-upload");
const backImageDiv = document.querySelector(".background-img-upload");

let image = null;
let banner = null;

// Create two hidden file inputs, one for each div
const profileInput = document.createElement("input");
profileInput.type = "file";
profileInput.accept = "image/*";
profileInput.style.display = "none";
document.body.appendChild(profileInput);

const backgroundInput = document.createElement("input");
backgroundInput.type = "file";
backgroundInput.accept = "image/*";
backgroundInput.style.display = "none";
document.body.appendChild(backgroundInput);

// Click handlers to trigger respective inputs
imgUploadDiv.addEventListener("click", () => {
  profileInput.click();
});

backImageDiv.addEventListener("click", () => {
  backgroundInput.click();
});

// Profile image selected
profileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  image = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imgUploadDiv.style.backgroundImage = `url(${e.target.result})`;
    imgUploadDiv.textContent = "";
    imgUploadDiv.style.backgroundSize = "cover";
    imgUploadDiv.style.backgroundPosition = "center";
  };
  reader.readAsDataURL(file);
});

// Background image selected
backgroundInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  banner = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    backImageDiv.style.backgroundImage = `url(${e.target.result})`;
    backImageDiv.textContent = "";
    backImageDiv.style.backgroundSize = "cover";
    backImageDiv.style.backgroundPosition = "center";
  };
  reader.readAsDataURL(file);
});

const interestTags = document.querySelectorAll(".interest-tag");
const selectedTagsContainer = document.getElementById(
  "selected-tags-container"
);
const selectedCount = document.getElementById("selected-count");
let selectedInterests = [];

interestTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const value = tag.getAttribute("data-value");

    if (tag.classList.contains("selected")) {
      // Deselect
      tag.classList.remove("selected");
      selectedInterests = selectedInterests.filter((item) => item !== value);
    } else {
      if (selectedInterests.length >= 10) {
        alert("You can select up to 10 interests.");
        return;
      }
      // Select
      tag.classList.add("selected");
      selectedInterests.push(value);
    }

    // Update UI
    updateSelectedTags();
  });
});

function updateSelectedTags() {
  selectedTagsContainer.innerHTML = "";
  selectedInterests.forEach((interest) => {
    const span = document.createElement("span");
    span.textContent = interest;
    span.className = "interest-tag selected";
    selectedTagsContainer.appendChild(span);
  });
  selectedCount.textContent = selectedInterests.length;
}

document.querySelector(".submit").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = sessionStorage.getItem("email");
  const password = sessionStorage.getItem("password");
  const username = document.querySelector(".name")?.value.trim() || null;
  const dob = document.querySelector(".dob")?.value.trim() || null;
  let gender = document.querySelector(".gender")?.value.trim() || null;
  if(gender=="Select Gender"){
    gender=null;
  }
  const about = document.querySelector("textarea[name='about']")?.value.trim() || null;

  if (!username) {
    customAlert("Please give your full name.");
    return;
  }

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("username", username);
  if(!dob){
    customAlert("you should give dob")
    return;
  }
  formData.append("dob", dob);
  formData.append("gender", gender);
  formData.append("about", about);  
  formData.append("is_active", true)
  if (image) {
    formData.append("image", image);
  } else {
    formData.append("image", "");
  }

  if (banner) {
    formData.append("banner", banner);
  } else {
    formData.append("banner", "");
  }

  if (selectedInterests.length > 0) {
  selectedInterests.forEach((interest) => {
    formData.append("interest", interest);
  });
} 
  const response=await callSigninUpAPI(formData)
  data=await response.json()
  console.log(data)
  if(response.ok){
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password")
    console.log("welcome to home page")
  }else{
    customAlert(data.message)
  }
});
