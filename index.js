import express from "express";
import session from "express-session";
import { dirname } from "path"
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import { log } from "console";
// import morgan from "morgan";

const app = express();
const port = 1600;

app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// app.use(morgan('common'));

const array=[];
var theme = 'dark_mode';
app.get('/', (req,res)=>{
    req.session.theme = theme;
    // console.log('GET: '+req.session.theme);
    if (array.length!==0){
        res.render('home.ejs', {data: array, currentTheme: req.session.theme});
    } else{
        res.render('home.ejs', {currentTheme: req.session.theme});
    }
})
app.post('/add', (req,res)=>{
    const data = req.body;
    array.push(data);
    console.log(array);
    res.redirect('/');
})
app.post('/remove/:id', (req,res)=>{ //same for checked
    array.splice(req.params.id, 1)
    res.redirect('/');
})
app.post('/themeChanged', (req,res)=>{
    // console.log(req.session.theme);
    if (theme==='light_mode') {theme='dark_mode';}
    else {theme='light_mode';}
    console.log("POST: "+theme);
    res.redirect('/');
})
app.post('/crossOut/:id', (req,res)=>{
    let index = req.params.id;
    let obj;
    if (array[index].striked){
        obj = {striked: false};
    } else {
        obj = {striked: true};
    }
    res.send(obj.striked);
    Object.assign(array[index], obj);
    // res.redirect('/');
});
app.listen(port, ()=>{
    log(`Server starting on port ${port}.`);
});

