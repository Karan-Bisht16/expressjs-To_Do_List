const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const date_time = document.getElementById('date_time');
date_time.innerHTML = dayName[date.getDay()]+', '+monthNames[date.getMonth()]+' '+date.getDate();

// const currentTheme = 'dark_mode';

const body = document.querySelector('body');
const header = document.querySelector('header');
const footer = document.querySelector('footer');

const themeBtn = document.querySelector("#themeBtn");

function changeTheme(){
    var currentTheme = themeBtn.getAttribute('theme');
    const container = document.querySelectorAll('.container');
    if (currentTheme === 'dark_mode'){
        var currentSrc = './images/img-light-mode.png';
        var currentAltText = 'dark mode on';
        themeBtn.classList.add('dark_mode_modification');
        header.classList.remove('light_mode');
        footer.classList.remove('light_mode');
        body.classList.remove('light_mode');
        if (container!==null){
            container.forEach(item =>{
                item.classList.remove('light_mode');
            });
        }
    } else if (currentTheme === 'light_mode') {
        var currentSrc = './images/img-dark-mode.png';
        var currentAltText = 'light mode on';
        themeBtn.classList.remove('dark_mode_modification');
        header.classList.add('light_mode');
        footer.classList.add('light_mode');
        body.classList.add('light_mode');
        if (container!==null){
            container.forEach(item =>{
                item.classList.add('light_mode');
            });
        }
    }
    themeBtn.setAttribute('src', currentSrc);
    themeBtn.setAttribute('alt', currentAltText);
}

window.onload=changeTheme();

themeBtn.addEventListener('click', async function(){
    const currentURL = window.location.href+'themeChanged';
    const response = await fetch(currentURL, {method:'POST'});
    const url = await response.json();
    if (url) {
        var theme = themeBtn.getAttribute('theme');
        if (theme==='dark_mode') {
            themeBtn.setAttribute('theme', 'light_mode');
        } else if (theme==='light_mode') {
            themeBtn.setAttribute('theme', 'dark_mode');
        }
        changeTheme();
    } else {
        console.log('Internal Server Error');
    }
});

const mainInput = document.querySelector('#mainField');
const tasks = document.querySelector('#tasks');
mainInput.addEventListener('keyup', async function(event){
    console.log(event.keyCode);
    if (event.keyCode === 13){
        const taskTitle = mainInput.value.trim();
        if (taskTitle!==''){
            var currentURL = window.location.href+'add/'+taskTitle;                                // #, /, %, ., ?, \
            const response = await fetch(currentURL, {method: 'POST'});
            const url = await response.json();
            if (url){
                const index = url.currentIndex;
                tasks.innerHTML+=
                    `<div class='container visible ${url.currentTheme}'>
                        <form class="formLabel" value="${index}" onclick="strikeTask(this);">
                            <label><input type='checkbox' value='${index}' style="display: none;"> ${taskTitle}</label>
                        </form>
                        <button class='removeBtn' value='${index}' onclick="removeTask(this);">Remove</button>
                    </div>`
            } else{
                res.render('Internal Server Error');
            }
        }
        mainInput.value='';
    }
});
/*
const popUp = document.querySelector('#popUp');
const allTasks = document.getElementsByClassName('visible');
let flag = 0;
function searchTask() {
    popUp.classList.remove('active');
    for (var i=0; i<arrayOfTasks.length; i++){
        allTasks[i].classList.add('hidden');  
        if (arrayOfTasks[i].toLowerCase()==searchValue.value.trim().toLowerCase()){
            var index = arrayOfTasks.indexOf(searchValue.value.trim());
            const found = document.getElementById('activity'+index);
            found.classList.remove('hidden');
            flag=1;
        }
        
    }
    if (flag===0){
        popUp.classList.add('active');
    }
    searchValue.value='';
    flag=0;
}
const items = document.querySelectorAll(".searchItem");
*/

function searchItem(event){
    var searchValue = document.querySelector('#search');
    if (event.keyCode === 13) {
        event.preventDefault();
        searchValue.blur();
        return;
    }
    var filter, txtValue;
    filter = searchValue.value.trim().toUpperCase();
    const searchList = document.querySelectorAll('.visible');
    const itemsArray = Array.from(searchList);
    itemsArray.forEach(item =>{
        let i=0;
        txtValue = item.textContent;
        if (txtValue.toUpperCase().indexOf(filter)>-1){
            item.style.display='';
        } else {
            item.style.display='none';
        }
    });
}

const backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', ()=>{
    const searchList = document.querySelectorAll('.visible');
    searchList.forEach(task =>{
        task.style.display='';
    });
});

async function strikeTask(label){
    var currentURL = window.location.href+'crossOut/'+label.getAttribute('value');
    const response = await fetch(currentURL, {method: "POST"});
    const url = await response.json();
    if (url.striked) {
        label.children[0].classList.add('isChecked');
    } else if (!url.striked) {
        label.children[0].classList.remove('isChecked');
    }

}

async function removeTask(element){
    var currentURL = window.location.href+'remove/'+element.getAttribute('value');
    const response = await fetch(currentURL, {method: 'POST'});
    const url = await response.json();
    if (url.deleted) {
        const index = element.getAttribute('value');
        element.parentNode.remove();
        const allTasks = document.querySelectorAll('.container');
        allTasks.forEach((task)=>{
            if (task.children[0].getAttribute('value')>index){
                const form = task.children[0];
                form.setAttribute('value', (form.getAttribute('value')-1));
                const remove = task.children[1];
                remove.setAttribute('value', (remove.getAttribute('value')-1));
                const label = form.children[0];
                label.setAttribute('value', (label.getAttribute('value')-1));
            }
        })
    } else {
        console.log('Internal Server Error');
    }
}