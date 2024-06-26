window.onbeforeunload = function () {
    if (!isLoggedIn()) {
        if (document.querySelectorAll(".active-task").length != 0) {
            return "Changes you made may not be saved.";
        }
    }
};

const activeList = document.querySelector(".active-list");
const title = document.querySelector(".active-title");
title.textContent = activeList.textContent;

const taskInfo = document.querySelector(".active-tasks-info");
function updateCounter() {
    let allTasks = document.querySelectorAll(".active-task");
    let string = " tasks "
    if (allTasks.length < 2) {
        string = " task ";
    }
    taskInfo.textContent = allTasks.length + string;
    let tasks = document.querySelectorAll(".task");
    if (tasks.length === 0) {
        try {
            document.getElementById("tasks").innerHTML = `<p class="if-empty">Add something spicy to your list</p>`;
        } catch (error) { }
    }
}
updateCounter();

function isLoggedIn() {
    const loggedInElement = document.getElementById("is-logged-in");
    return loggedInElement.getAttribute("value") === "true";
}
// Add task
const tasks = document.getElementById("tasks")
const newTask = document.getElementById("add-task-field");
async function addTask() {
    event.preventDefault();
    const newTaskTitle = newTask.value.trim()
    if (newTaskTitle !== "") {
        let currentURL = window.location.origin + "/add-task";
        try {
            const response = await fetch(currentURL, {
                method: "PUT",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newTaskTitle
                })
            });
            if (!response.ok && !response.status === 200) {
                alert("Network error. Please refresh.");
            } else {
                const decodedResponse = await response.json();
                if (document.body.classList.contains("dark")) {
                    tasks.innerHTML +=
                        `<div class="task d-flex mt-2">
                            <label class="active-task form-control me-2" value="${decodedResponse.taskID}" onclick="strikeTask(this)">
                                <input type="checkbox" style="display: none;">${newTaskTitle}
                            </label>
                            <button type="button" class="primary-toggle edit-btn btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#editTaskModal" value="${decodedResponse.taskID}" onclick="editTaskModal(this)">
                                <span>Edit</span>
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="primary-toggle remove-btn btn btn-primary" value="${decodedResponse.taskID}" onclick="removeTask(this)">
                                <span>Remove</span>
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>`;
                } else {
                    tasks.innerHTML +=
                        `<div class="task d-flex mt-2">
                            <label class="active-task form-control me-2" value="${decodedResponse.taskID}" onclick="strikeTask(this)">
                                <input type="checkbox" style="display: none;">${newTaskTitle}
                            </label>
                            <button type="button" class="primary-toggle edit-btn btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#editTaskModal" value="${decodedResponse.taskID}" onclick="editTaskModal(this)">
                                <span>Edit</span>
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="primary-toggle remove-btn btn btn-outline-primary" value="${decodedResponse.taskID}" onclick="removeTask(this)">
                                <span>Remove</span>
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>`;
                }
                try {
                    document.querySelector(".if-empty").style.display = "none";
                } catch (error) { }
                updateCounter();
            }
        } catch (error) {
            console.log("Error in /add-task:", error);
        }
    }
    newTask.value = "";
}
// Strike task
async function strikeTask(labelElement) {
    let currentURL = window.location.origin + "/strike-task";
    let striked = true;
    if (labelElement.classList.contains("active-task")) {
        striked = false;
    }
    try {
        const response = await fetch(currentURL, {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskID: labelElement.getAttribute("value"),
                is_striked: striked
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            const decodedResponse = await response.json();
            if (decodedResponse.striked) {
                labelElement.classList.remove("active-task");
            } else if (!decodedResponse.striked) {
                labelElement.classList.add("active-task");
            }
            updateCounter();
        }
    } catch (error) {
        console.log("Error in /strike-task:", error);
    }
}
// Remove task
async function removeTask(buttonElement) {
    let currentURL = window.location.origin + "/remove-task";
    try {
        const response = await fetch(currentURL, {
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskID: buttonElement.getAttribute("value")
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            const parentElement = buttonElement.parentNode;
            parentElement.remove();
            updateCounter();
        }
    } catch (error) {
        console.log("Error in /remove-task:", error);
    }
}
// Edit task
const editTaskModalElement = document.getElementById("editTaskModal");
const editTaskField = document.getElementById("edit-task-title");
editTaskField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("edit-task").click();
    }
});
editTaskModalElement.addEventListener("shown.bs.modal", function () {
    editTaskField.focus();
});
function editTaskModal(buttonElement) {
    let filterString = ".task>label[value='" + buttonElement.getAttribute("value") + "']";
    editTaskField.value = document.querySelector(filterString).textContent.trim();
    confirmationButton = document.getElementById("edit-task");
    confirmationButton.setAttribute("value", buttonElement.getAttribute("value"));
}
async function editTask(buttonElement) {
    let currentURL = window.location.origin + "/edit-task";
    try {
        const response = await fetch(currentURL, {
            method: "PATCH",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskID: buttonElement.getAttribute("value"),
                title: editTaskField.value
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            document.getElementById("edit-task-close-btn").click();
            let filterString = ".task>label[value='" + buttonElement.getAttribute("value") + "']";
            document.querySelector(filterString).textContent = editTaskField.value;
        }
    } catch (error) {
        console.log("Error in /rename-list:", error);
    }
    editTaskField.value = "";
}

// Add list
const lists = document.getElementById("lists")
const newList = document.getElementById("add-list-field");
async function addList() {
    event.preventDefault();
    const newListTitle = newList.value.trim()
    if (newListTitle !== "") {
        let currentURL = window.location.origin + "/add-list";
        try {
            const response = await fetch(currentURL, {
                method: "POST",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newListTitle
                })
            });
            if (!response.ok) {
                if (response.status === 403) {
                    alert("Feature available for registered user only.");
                } else if (!response.status === 200) {
                    alert("Network error. Please refresh.");
                }
            } else {
                const decodedResponse = await response.json();
                lists.innerHTML +=
                    `<li class="nav-item list d-flex">        
                        <label class="nav-link form-control me-2" aria-current="page" value="${decodedResponse.listID}" 
                            onclick="changeList(this)">${newListTitle}</label>                    
                        <button type="button" class="btn btn-outline-primary mt-1 me-1" data-bs-toggle="modal" data-bs-target="#renameListModal"
                            value="${decodedResponse.listID}" onclick="renameListModal(this)">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button type="button" class="btn btn-outline-primary mt-1" data-bs-toggle="modal" 
                            value="${decodedResponse.listID}" onclick="deleteListModal(this)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </li>`;
            }
        } catch (error) {
            console.log("Error in /add-list:", error);
        }
    }
    newList.value = "";
}
// Change list
async function changeList(labelElement) {
    if (!labelElement.classList.contains("active-list")) {
        let currentURL = window.location.origin + "/change-list";
        try {
            const response = await fetch(currentURL, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    listID: labelElement.getAttribute("value")
                })
            });
            if (!response.ok) {
                if (response.status === 403) {
                    alert("Feature available for registered user only.");
                } else if (!response.status === 200) {
                    alert("Network error. Please refresh.");
                }
            } else {
                const currentActiveList = document.querySelector(".active-list");
                currentActiveList.classList.remove("active-list");
                labelElement.classList.add("active-list");
                location.reload();
            }
        } catch (error) {
            console.log("Error in /change-list:", error);
        }
    }
}
// Rename list
const renameListModalElement = document.getElementById("renameListModal");
const renameListField = document.getElementById("rename-list-title");
renameListField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("rename-list").click();
    }
});
renameListModalElement.addEventListener("shown.bs.modal", function () {
    renameListField.focus();
});
function renameListModal(buttonElement) {
    let filterString = "label.nav-link[value='" + buttonElement.getAttribute("value") + "']";
    renameListField.value = document.querySelector(filterString).textContent.trim();
    confirmationButton = document.getElementById("rename-list");
    confirmationButton.setAttribute("value", buttonElement.getAttribute("value"));
}
async function renameList(buttonElement) {
    let currentURL = window.location.origin + "/rename-list";
    try {
        const response = await fetch(currentURL, {
            method: "PATCH",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                listID: buttonElement.getAttribute("value"),
                title: renameListField.value
            })
        });
        if (!response.ok) {
            if (response.status === 403) {
                alert("Feature available for registered user only.");
            } else if (!response.status === 200) {
                alert("Network error. Please refresh.");
            }
        } else {
            document.getElementById("rename-list-close-btn").click();
            let filterString = "label.nav-link[value='" + buttonElement.getAttribute("value") + "']";
            document.querySelector(filterString).textContent = renameListField.value;
            title.textContent = activeList.textContent;
        }
    } catch (error) {
        console.log("Error in /rename-list:", error);
    }
}
// Delete list
let confirmationButton = document.body;
const deleteListModalElement = document.getElementById("deleteListModal");
deleteListModalElement.addEventListener("shown.bs.modal", function () {
    confirmationButton.focus();
});
function deleteListModal(buttonElement) {
    if (document.querySelectorAll(".list").length < 2) {
        buttonElement.setAttribute("data-bs-target", "#atleastModal");
        buttonElement.click();
    } else {
        buttonElement.setAttribute("data-bs-target", "#deleteListModal");
        buttonElement.click();
        confirmationButton = document.getElementById("confirm-delete-list");
        confirmationButton.setAttribute("value", buttonElement.getAttribute("value"));
    }
}
async function deleteList(buttonElement) {
    let currentURL = window.location.origin + "/delete-list";
    try {
        const response = await fetch(currentURL, {
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                listID: buttonElement.getAttribute("value")
            })
        });
        if (!response.ok) {
            if (response.status === 403) {
                alert("Feature available for registered user only.");
            } else if (!response.status === 200) {
                alert("Network error. Please refresh.");
            }
        } else {
            const decodedResponse = await response.json();
            if (decodedResponse.currentListDeleted) {
                location.reload();
            } else {
                document.getElementById("delete-list-close-btn").click();
                let filterString = "label.nav-link[value='" + buttonElement.getAttribute("value") + "']";
                const parentElement = document.querySelector(filterString).parentNode;
                parentElement.remove();
            }
        }
    } catch (error) {
        console.log("Error in /delete-list:", error);
    }
}