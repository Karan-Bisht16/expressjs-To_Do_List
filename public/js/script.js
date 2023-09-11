const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const date_time = document.getElementById('date_time');
date_time.innerHTML = dayName[date.getDay()]+', '+monthNames[date.getMonth()]+' '+date.getDate();

const body = document.querySelector('body');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const container = document.querySelectorAll('.container');

function theme(){
    var currentSrc = themeBtn.getAttribute('src');
    var currentAltText = themeBtn.getAttribute('alt');
    var currentTheme = themeBtn.getAttribute('theme');
    if (currentTheme==='dark_mode'){
        currentSrc = './images/img-light-mode.png';
        currentAltText = 'dark mode on';
        themeBtn.classList.add('light_mode_modification');
        header.classList.remove('gradient_background_light_mode');
        header.classList.add('gradient_background_dark_mode');
        footer.classList.remove('gradient_background_light_mode');
        footer.classList.add('gradient_background_dark_mode');
        body.classList.add('dark_mode');
        if (container!==null){
            container.forEach(item =>{
                item.classList.add('dark_mode');
            });
        }
    } else {
        currentSrc = './images/img-dark-mode.png';
        currentAltText = 'light mode on';
        themeBtn.classList.remove('light_mode_modification');
        header.classList.remove('gradient_background_dark_mode');
        header.classList.add('gradient_background_light_mode');
        footer.classList.remove('gradient_background_dark_mode');
        footer.classList.add('gradient_background_light_mode');
        body.classList.remove('dark_mode');
        if (container!==null){
            container.forEach(item =>{
                item.classList.remove('dark_mode');
            });
        }
    }
    themeBtn.setAttribute('src', currentSrc);
    themeBtn.setAttribute('alt', currentAltText);
};

window.onload=theme();

let i=0;
let arrayOfTasks = [];

const mainInput =document.querySelector('#mainField');
const tasks = document.querySelector('#tasks');
mainInput.addEventListener('keyup', function(event){
    if (event.key==='Enter'){
        const taskTitle = mainInput.value.trim();
        if (taskTitle!==''){
            var url;
            var xhttp = new XMLHttpRequest();
            var currentURL = window.location.href+'add/'+taskTitle;                            // #, /, %, ., ?, \
            xhttp.open('POST',currentURL, true);
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    url = JSON.parse(xhttp.responseText);
                    const index = url.currentIndex;
                    if (url){
                        // console.log('nice cock');
                        tasks.innerHTML+=
                            `<div class='container visible dark_mode' id="activity${index}">
                                <form id="formLabel${index}" class="formLabel" value="${index}" onclick="strikeTask(this);">
                                    <label id='label${index}'><input type='checkbox' value='${index}' style="display: none;"> ${taskTitle}</label>
                                </form>
                                <form action="/remove/${index}" method="post">
                                    <button class='removeBtn' value='${index}'>Remove</button>
                                </form>
                            </div>`
                        theme();                                                               // Make container follow the theme
                    } else{
                        res.render('Internal Server Error');
                    }
                }
            };
            xhttp.send();
        }
        mainInput.value='';
    }
})
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
    if (event.key === "Enter") {
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
// );

const backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', ()=>{
    const searchList = document.querySelectorAll('.visible');
    searchList.forEach(task =>{
        task.style.display='';
    });
});

function strikeTask(label){
    var url;
    var xhttp = new XMLHttpRequest();
    var currentURL = window.location.href+'crossOut/'+label.getAttribute('value');
    xhttp.open('POST',currentURL, true);
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            url = JSON.parse(xhttp.responseText);
            if (url.striked){
                label.children[0].classList.add('isChecked');
            } else if (!url.striked){
                label.children[0].classList.remove('isChecked');
            }
        }
    };
    xhttp.send();
}