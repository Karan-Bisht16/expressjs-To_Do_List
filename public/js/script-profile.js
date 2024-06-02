const oldPasswordElement = document.getElementById("currentUserPassword");
const newPasswordElement = document.getElementById("newUserPassword");
const changePasswordButton = document.getElementById("change-password-btn");
const passwordError = document.getElementById("password-error");

oldPasswordElement.addEventListener("keypress", (event => {
    if (event.key === "Enter") {
        if (newPasswordElement.value.trim() === "") {
            newPasswordElement.focus();
        } else if (newPasswordElement.value.trim() !== "") {
            changePasswordValidation();
        }
    }
}));
newPasswordElement.addEventListener("keypress", (event => {
    if (event.key === "Enter") {
        if (oldPasswordElement.value.trim() === "") {
            oldPasswordElement.focus();
        } else if (oldPasswordElement.value.trim() !== "") {
            changePasswordValidation();
        }
    }
}));
function changePasswordValidation() {
    let oldPassword = oldPasswordElement.value.trim();
    let newPassword = newPasswordElement.value.trim();
    if (oldPassword === "" || newPassword === "") {
        if (oldPassword === "") { oldPasswordElement.focus(); }
        else { newPasswordElement.focus(); }
        passwordError.textContent = "Please fill both fields";
        setTimeout(() => {
            passwordError.textContent = "";
        }, 1000);
    } else {
        changePasswordButton.setAttribute("data-bs-target", "#changePasswordModal");
        changePasswordButton.click();
    }
}

async function changePassword() {
    let currentURL = window.location.href + "/change-password";
    try {
        const response = await fetch(currentURL, {
            method: "PATCH",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: oldPasswordElement.value,
                newPassword: newPasswordElement.value
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            const decodedResponse = await response.json();
            if (decodedResponse.code === 0) {
                document.getElementById("change-password-close-btn").click();
                passwordError.textContent = "Incorrect password";
                setTimeout(() => {
                    passwordError.textContent = "";
                }, 1000);
            } else if (decodedResponse.code === 1) {
                location.reload();
            } else if (decodedResponse.code === 2) {
                document.getElementById("change-password-close-btn").click();
                passwordError.textContent = "Invalid access";
                setTimeout(() => {
                    passwordError.textContent = "";
                }, 1000);
            } else {
                document.getElementById("change-password-close-btn").click();
                passwordError.textContent = "Failed to update password. Try again.";
                setTimeout(() => {
                    passwordError.textContent = "";
                }, 1000);

            }
        }
    } catch (error) {
        console.log("Error in /change-password:", error);
    }
}

const logoutModal = document.getElementById("logoutModal");
logoutModal.addEventListener("shown.bs.modal", function () {
    document.getElementById("confirm-logout").focus();
});
const changePasswordModal = document.getElementById("changePasswordModal");
changePasswordModal.addEventListener("shown.bs.modal", function () {
    document.getElementById("change-password").focus();
});
const deleteModal = document.getElementById("deleteModal");
deleteModal.addEventListener("shown.bs.modal", function () {
    document.getElementById("confirm-delete").focus();
});