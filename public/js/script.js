const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const date_time = document.getElementById('date_time');
date_time.innerHTML = dayName[date.getDay()]+', '+monthNames[date.getMonth()]+' '+date.getDate();

const resultDiv = document.querySelector('#result');

const body = document.querySelector('body');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
// const themeBtn = document.querySelector('themeBtn');//wrong
const container = document.querySelectorAll('.container');

window.onload=(event)=>{
    var currentSrc = themeBtn.getAttribute('src');
    var currentAltText = themeBtn.getAttribute('alt');
    var currentTheme = themeBtn.getAttribute('theme');
    if (currentTheme==='dark_mode'){
        currentSrc = './images/img-light-mode.png';
        currentAltText = 'dark mode on';
        // currentTheme = 'light_mode';
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
        // currentTheme = 'dark_mode';
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
    // themeBtn.setAttribute('theme', currentTheme);
};

// themeBtn.addEventListener('click', ()=>{
//     var currentTheme = themeBtn.getAttribute('src');
//     var currentAltText = themeBtn.getAttribute('alt');
//     console.log('before submit: '+themeBtn.getAttribute('theme'));
//     themeBtn.parentNode.submit();
//     setTimeout(console.log('after submit: '+themeBtn.getAttribute('theme')),100)
//     var yes = themeBtn.getAttribute('theme');
//     // console.log(themeBtn.getAttribute('theme'));
//     // if (currentTheme==='./images/img-dark-mode.png'){
//     if (yes==='light_mode'){
//         currentTheme = './images/img-light-mode.png';
//         currentAltText = 'dark mode on';
//         themeBtn.classList.add('light_mode_modification');
//         header.classList.remove('gradient_background_light_mode');
//         header.classList.add('gradient_background_dark_mode');
//         footer.classList.remove('gradient_background_light_mode');
//         footer.classList.add('gradient_background_dark_mode');
//         body.classList.add('dark_mode');
//         if (container!==null){
//             container.classList.add('dark_mode');
//         }
//     } else {
//         currentTheme = './images/img-dark-mode.png';
//         currentAltText = 'light mode on';
//         themeBtn.classList.remove('light_mode_modification');
//         header.classList.remove('gradient_background_dark_mode');
//         header.classList.add('gradient_background_light_mode');
//         footer.classList.remove('gradient_background_dark_mode');
//         footer.classList.add('gradient_background_light_mode');
//         body.classList.remove('dark_mode');
//         if (container!==null){
//             container.classList.remove('dark_mode');
//         }
//     }
//     themeBtn.setAttribute('src', currentTheme);
//     themeBtn.setAttribute('alt', currentAltText);
//     themeBtn.setAttribute('theme', yes);
// });

// mainInput.addEventListener("keypress", function(event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         addTaskOperation();
//     }
// });

const searchValue = document.querySelector('#search');
searchValue.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchBtn").click();
    }
});

let i=0;
let arrayOfTasks = [];

function addTaskOperation() {
    restoreOriginal();
    const taskTitle = mainInput.value.trim()
    if (taskTitle!==''){
        resultDiv.innerHTML+=
        `<div class="visible" id='activity`+i+`'>
            <div class='container'>
                <label id='label`+i+`'><input type='checkbox' onclick='strikeTask(this);' value=`+i+`> `+taskTitle+`</label>
                <button class='removeBtn' onclick='remove(this);' value=`+i+`>Remove</button>
            </div>
        </div>`;
        arrayOfTasks.push(taskTitle);
        i++;
    }
    mainInput.value='';
}
    
// function strikeTask(element) {
//     const toStrike = document.getElementById('label'+element.value);
//     var string = toStrike.innerHTML;
//     if (!toStrike.classList.contains('isChecked')){
//         toStrike.classList.add('isChecked');
//         var index = toStrike.innerHTML.indexOf("value=")
//         var stringFirst = string.slice(0, index);
//         stringFirst+='checked ';
//         string = stringFirst.concat(string.slice(index, string.length));
//         toStrike.innerHTML=string;
//     } else {
//         toStrike.classList.remove('isChecked');
//         var index = toStrike.innerHTML.indexOf("checked")
//         var stringFirst = string.slice(0, index-1);
//         index+=10;
//         string = stringFirst.concat(string.slice(index, string.length));
//         toStrike.innerHTML=string;
//     }
// }

const popUp = document.querySelector('#popUp');
const allTasks = document.getElementsByClassName('visible');
let flag = 0;
// function searchTask() {
//     popUp.classList.remove('active');
//     for (var i=0; i<arrayOfTasks.length; i++){
//         allTasks[i].classList.add('hidden');  
//         if (arrayOfTasks[i].toLowerCase()==searchValue.value.trim().toLowerCase()){
//             var index = arrayOfTasks.indexOf(searchValue.value.trim());
//             const found = document.getElementById('activity'+index);
//             found.classList.remove('hidden');
//             flag=1;
//         }
        
//     }
//     if (flag===0){
//         popUp.classList.add('active');
//     }
//     searchValue.value='';
//     flag=0;
// }
// const items = document.querySelectorAll(".searchItem");

const searchList = document.querySelectorAll('.visible');
const itemsArray = Array.from(searchList);

function searchTask(){
    var input, filter, txtValue;
    input = document.querySelector('#search');
    filter = input.value.trim().toUpperCase();
    // console.log(filter);
    // if (filter.length>0){
    //     // console.log(searchList);
    //     searchList.forEach(task =>{
    //         task.classList.add('hidden');
    //     })
    // }
    let j=0;
    itemsArray.forEach(item =>{
        let i=0;
        txtValue = item.textContent;
        // console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter)>-1 && j<10){
            item.style.display='';
            j++;
        } else {
            item.style.display='none';
        }
    });
}
const backBtn = document.querySelector('#backBtn');
backBtn.addEventListener('click', ()=>{
    searchList.forEach(task =>{
        task.style.display='';
    });
    // document.querySelector('#search').textContent='';
    // setTimeout(document.querySelector('#search').innerHTML='',1000);

});

const formLabels = document.querySelectorAll('.formLabel');
formLabels.forEach(label =>{
    label.addEventListener('click',()=>{
        // console.log(label);
        var url;
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST','http://localhost:1600/crossOut/'+label.getAttribute('value'), true);
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                url = xhttp.responseText;
                console.log(url, typeof(url));
                if (url==='true'){
                    // const yes = document.querySelector();
                    const yes = label.children[0].textContent.trim();
                    const string = label.children[0].innerHTML;
                    const index = string.lastIndexOf(yes);
                    console.log('when to strike: '+string.slice(0,index)+'<s>'+yes+'</s>');
                    label.children[0].innerHTML = string.slice(0,index)+'<s>'+yes+' </s>';
                    // console.log('nice cock');
                } else if (url==='false'){
                    // console.log('fuck yeah');
                    const yes = label.children[0].textContent.trim();
                    console.log(yes);
                    const string = label.children[0].innerHTML;
                    // console.log('whot '+string);
                    const index = string.lastIndexOf('<s>');
                    console.log('Not to strike: '+string.slice(0,index)+yes);
                    label.children[0].innerHTML = string.slice(0,index)+yes;
                }
            }
        };
        xhttp.send();
    });
});