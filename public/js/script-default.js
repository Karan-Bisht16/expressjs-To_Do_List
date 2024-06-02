const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const dateTimeElement = document.getElementById("date-time");
dateTimeElement.textContent = dayName[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate();

const themeButton = document.getElementById("theme-button");

themeButton.addEventListener("click", () => {
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
});