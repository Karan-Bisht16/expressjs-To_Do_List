import express from "express";
import session from "express-session";
import { dirname } from "path"
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

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

var firstVist = true;
app.get('/', (req,res)=>{
    if (firstVist){
        firstVist = false;
        req.session.array = [];
        req.session.theme = 'dark_mode';
        res.render('home.ejs', {currentTheme: req.session.theme});
    } else{
        res.render('home.ejs', {data: req.session.array, currentTheme: req.session.theme});
    }
})

app.post('/add/:title', (req,res)=>{
    const data = {
        taskName: req.params.title,
        currentIndex: req.session.array.length,
        striked: false
    };
    req.session.array.push(data);
    Object.assign(data, {currentTheme: req.session.theme});
    res.send(data);

    console.log(req.session.array);
})

app.post('/crossOut/:id', (req,res)=>{
    let index = req.params.id;
    let obj;
    if (req.session.array[index].striked){
        req.session.array[index].striked = false;
        obj = {striked: false};
    } else {
        req.session.array[index].striked = true;
        obj = {striked: true};
    }
    res.send(obj);

    console.log(req.session.array);
});

app.post('/remove/:id', (req,res)=>{
    const obj = {deleted: false};
    if (req.session.array.splice(req.params.id, 1)){
        obj.deleted = true;
    };
    res.send(obj);
    
    console.log(req.session.array);
});

app.post('/themeChanged', (req,res)=>{
    if (req.session.theme==='light_mode') {req.session.theme='dark_mode';}
    else {req.session.theme='light_mode';}
    const obj = {currentTheme: req.session.theme};
    res.send(obj);
});

app.listen(port, ()=>{
    console.log(`Server starting on port ${port}.`);
});

/*
label hover backgroud color
add JS to all [theme].
work space 
add reset option
*/