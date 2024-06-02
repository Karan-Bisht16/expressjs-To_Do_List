const path = require("path")
const express = require("express");
const session = require("express-session");
require("dotenv").config();
var methodOverride = require("method-override");

const app = express();
const PORT = 1600;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

const mongoose = require("mongoose");
const connection = require("./database");
connection();

const MongoStore = require("connect-mongo");
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    mongooseConnection: mongoose.connection,
});

app.use(session({
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
}));

const home = require("./routes/home");
app.use(home);
const profile = require("./routes/profile");
app.use(profile);
const userAuthentication = require("./routes/userAuthentication");
app.use(userAuthentication);

app.listen(PORT, ()=>{
    console.log(`Server starting on port ${PORT}.`);
});

// var firstVist = true;
// app.get('/', (req,res)=>{
//     console.log("Executing app.get('/')");

//     if (firstVist){
//         firstVist = false;
//         req.session.array = [];
//         console.log('Initializing req.session.array:', req.session.array);
//         req.session.theme = 'dark_mode';
//         console.log("Initializing req.session.theme:", req.session.theme);
//         res.render('home.ejs', {currentTheme: req.session.theme});
//     } else{
//         res.render('home.ejs', {data: req.session.array, currentTheme: req.session.theme});
//     }
// })

// app.post('/add/:title', (req,res)=>{
//     console.log("Executing app.post('/add/:title')");

//     req.session.array = req.session.array || [];
//     const data = {
//         taskName: req.params.title,
//         currentIndex: req.session.array.length,
//         striked: false
//     };
//     req.session.array.push(data);

//     Object.assign(data, {currentTheme: req.session.theme});
//     res.send(data);

//     printData(req.session.array);
// })

// app.post('/crossOut/:id', (req,res)=>{
//     console.log("Executing app.post('/crossOut/:id')");

//     let index = req.params.id;
//     let obj;
//     if (req.session.array[index].striked){
//         req.session.array[index].striked = false;
//         obj = {striked: false};
//     } else {
//         req.session.array[index].striked = true;
//         obj = {striked: true};
//     }
//     res.send(obj);
    
//     printData(req.session.array);
// });

// app.post('/remove/:id', (req,res)=>{
//     console.log("Executing app.post('/remove/:id')");

//     const obj = {deleted: false};
//     if (req.session.array.splice(req.params.id, 1)){
//         obj.deleted = true;
//     };
//     res.send(obj);
    
//     printData(req.session.array);
// });

// app.post('/themeChanged', (req,res)=>{
//     console.log("Executing app.post('/themeChanged')");

//     if (req.session.theme==='light_mode') {req.session.theme='dark_mode';}
//     else {req.session.theme='light_mode';}
//     const obj = {currentTheme: req.session.theme};
//     res.send(obj);
// });

// function printData(array){
//     array.forEach(object => {
//         console.log(object.taskName+", "+object.currentIndex+", "+object.striked);
//     });
// }

/*
label hover backgroud color
work space 
add reset option
search popup 
invalid character popup
https://developer.chrome.com/docs/devtools/remote-debugging/
https://stackoverflow.com/questions/71233195/failed-to-load-resource-the-server-responded-with-a-status-of-500-in-when-de
https://www.reddit.com/r/webdev/comments/jrwa42/whats_the_difference_between_xmlhttp_http_ajax/?rdt=53378
*/