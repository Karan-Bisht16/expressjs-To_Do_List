window.onbeforeunload = function() {
    if (!isLoggedIn()) {
        if (document.querySelectorAll(".active-task").length!=0) {
            return "Changes you made may not be saved.";
        }
    }
};

let activeList = document.querySelector(".active-list");
let title = document.querySelector(".active-title");
title.textContent = activeList.textContent;

const taskInfo = document.querySelector(".active-tasks-info");
function updateCounter() {
    let allTasks = document.querySelectorAll(".active-task");
    let string = " tasks "
    if (allTasks.length < 2) {
        string = " task ";
    }
    taskInfo.textContent = allTasks.length + string;
}
updateCounter();

function isLoggedIn(){
    const loggedInElement = document.getElementById("is-logged-in");
    return loggedInElement.getAttribute("value")==="true";
}
const tasks = document.getElementById("tasks")
const newTask = document.getElementById("add-task-field");
async function addTask() {
    event.preventDefault();
    const newTaskTitle = newTask.value.trim()
    if (newTaskTitle !== "") {
        let currentURL = window.location.href + "add-task";
        // if (isLoggedIn()) {
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
                tasks.innerHTML +=
                    `<div class="task d-flex mt-2">
                        <label class="active-task form-control me-2" value="${decodedResponse.taskID}" onclick="strikeTask(this)">
                            <input type="checkbox" style="display: none;">${newTaskTitle}
                        </label>
                        <button class="primary-toggle btn edit-btn btn-outline-primary me-2" value="${decodedResponse.taskID}" onclick="editTask(this)">Edit</button>
                        <button class="primary-toggle btn remove-btn btn-outline-primary" value="${decodedResponse.taskID}" onclick="removeTask(this)">Remove</button>
                    </div>`;
                try {
                    document.querySelector(".if-empty").style.display = "none";
                } catch (error) {}
                updateCounter();
            }
        } catch (error) {
            console.log("Error in /add-task:", error);
        }
        // } else {
        //     tasks.innerHTML +=
        //         `<div class="task d-flex mt-2">
        //             <label class="active-task form-control me-2" value=null onclick="strikeTask(this)">
        //                 <input type="checkbox" style="display: none;">${value}
        //             </label>
        //             <button class="btn edit-btn btn-outline-primary me-2" value=null onclick="editTask(this)">Edit</button>
        //             <button class="btn remove-btn btn-outline-primary" value=null onclick="removeTask(this)">Remove</button>
        //         </div>`;
        //     try {
        //         document.querySelector(".if-empty").style.display = "none";
        //     } catch (error) {}
        //     updateCounter();
        // }
    }
    newTask.value = "";
}

async function strikeTask(labelElement) {
    let currentURL = window.location.href + "strike-task";
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

async function removeTask(buttonElement) {
    let currentURL = window.location.href + "remove-task";
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

async function changeList(labelElement) {
    if (!labelElement.classList.contains("active-list")) {
        let currentURL = window.location.href + "change-list";
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
            if (!response.ok && !response.status === 200) {
                alert("Network error. Please refresh.");
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

const lists = document.getElementById("lists")
const newList = document.getElementById("add-list-field");
async function addList(){
    event.preventDefault();
    const newListTitle = newList.value.trim()
    if (newListTitle !== "") {
        let currentURL = window.location.href + "add-list";
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
            if (!response.ok && !response.status === 200) {
                alert("Network error. Please refresh.");
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

let confirmationButton = document.body;
const deleteModal = document.getElementById("deleteModal");
deleteModal.addEventListener("shown.bs.modal", function () {
    confirmationButton.focus();
});
function deleteListModal(buttonElement) {
    if (document.querySelectorAll(".list").length<2) {
        buttonElement.setAttribute("data-bs-target","#atleastModal");
        buttonElement.click();
    } else {
        buttonElement.setAttribute("data-bs-target","#deleteModal");
        buttonElement.click();
        confirmationButton = document.getElementById("confirm-delete");
        confirmationButton.setAttribute("value", buttonElement.getAttribute("value"));
    }
}

async function deleteList(buttonElement) {
    let currentURL = window.location.href + "remove-list";
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
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            const decodedResponse = await response.json();
            if (decodedResponse.currentListDeleted) {
                location.reload();
            } else {
                document.getElementById("delete-list-close-btn").click();
                let filterString = "label.nav-link[value='"+buttonElement.getAttribute("value")+"']";
                const parentElement = document.querySelector(filterString).parentNode;
                parentElement.remove();
            }
        }
    } catch (error) {
        console.log("Error in /remove-list:", error);
    }
}

const renameModal = document.getElementById("renameListModal");
renameModal.addEventListener("shown.bs.modal", function () {
    const renameField = document.getElementById("rename-list-title");
    renameField.focus();
    renameField.addEventListener("keypress", (e)=>{
        if (e.key==="Enter"){
            document.getElementById("rename-list").click();
        }
    });
});
function renameListModal(buttonElement) {
    confirmationButton = document.getElementById("rename-list");
    confirmationButton.setAttribute("value", buttonElement.getAttribute("value"));
}

async function renameList(buttonElement) {
    const newListTitle = document.getElementById("rename-list-title").value;
    let currentURL = window.location.href + "rename-list";
    try {
        const response = await fetch(currentURL, { 
            method: "PATCH",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                listID: buttonElement.getAttribute("value"),
                title: newListTitle
            })
        });
        if (!response.ok && !response.status === 200) {
            alert("Network error. Please refresh.");
        } else {
            document.getElementById("rename-list-close-btn").click();
            let filterString = "label.nav-link[value='"+buttonElement.getAttribute("value")+"']";
            document.querySelector(filterString).textContent = newListTitle;
        }
    } catch (error) {
        console.log("Error in /rename-list:", error);
    }
}