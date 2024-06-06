const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const dateTimeElement = document.getElementById("date-time");
dateTimeElement.textContent = dayName[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate();

const themeButton = document.getElementById("theme-button");

themeButton.addEventListener("click", async () => {
    document.body.classList.toggle("dark");
    let secondaryButton = document.querySelectorAll(".secondary-toggle");
    secondaryButton.forEach(button => {
        button.classList.toggle("btn-outline-secondary");
        button.classList.toggle("btn-secondary");
    });
    let primaryButton = document.querySelectorAll(".primary-toggle");
    primaryButton.forEach(button => {
        button.classList.toggle("btn-outline-primary");
        button.classList.toggle("btn-primary");
    });
    const baseURL = window.location.origin + "/change-theme";
    try {
        const response = await fetch(baseURL, {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                theme: document.body.classList.contains("dark")
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        }
    } catch (error) {
        console.log("Error in /change-theme: " + error);
    }
});