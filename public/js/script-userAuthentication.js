const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

function redirectIfIncorrectPassword() {
    wrapper.classList.add("active-form");
    document.querySelector(".server-side-error").style.display = "none";
}

loginLink.addEventListener("click", () => {
    wrapper.classList.add("active-form");
});

registerLink.addEventListener("click", () => {
    wrapper.classList.remove("active-form");
});

const showLoginPassword = document.getElementById("show-login-password");
const userLoginPassword = document.getElementById("user-login-password");

showLoginPassword.addEventListener("click", () => {
    userLoginPassword.setAttribute("type", "text");
    setTimeout(() => {
        userLoginPassword.setAttribute("type", "password")
    }, 1000);
});
const showRegisterPassword = document.getElementById("show-register-password");
const userRegisterPassword = document.getElementById("user-register-password");

showRegisterPassword.addEventListener("click", () => {
    userRegisterPassword.setAttribute("type", "text");
    setTimeout(() => {
        userRegisterPassword.setAttribute("type", "password")
    }, 1000);
});

const regexEmail = /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]+)/;

function registrationValidation() {
    let registerEmail = document.getElementById("register-email");
    console.log(registerEmail.value);
    if (!regexEmail.test(registerEmail.value)){
        try {
            document.querySelector(".server-side-error").style.display = "none";
        } catch(error) {
            console.log(error);
        }
        let error = document.querySelector(".error");
        error.textContent = "Invalid email";
        error.style.display = "";
        setTimeout(()=>{
            error.style.display = "none"
        }, 1000);
        return false;
    }
    return true;
}

function loginValidation() {
    let loginEmail = document.getElementById("login-email");
    console.log(loginEmail.value);
    if (!regexEmail.test(loginEmail.value)) {
        try {
            document.querySelector(".server-side-error").style.display = "none";
        } catch(error) {
            console.log(error);
        }
        let error = document.querySelector(".error");
        error.textContent = "Invalid email";
        error.style.display = "";
        setTimeout(()=>{
            error.style.display = "none"
        }, 1000);
        return false;
    }
    return true;
}
