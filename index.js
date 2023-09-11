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

const array=[];
var theme = 'dark_mode';
app.get('/', (req,res)=>{
    req.session.theme = theme;
    req.session.array = array;
    if (array.length!==0){
        res.render('home.ejs', {data: req.session.array, currentTheme: req.session.theme});
    } else{
        res.render('home.ejs', {currentTheme: req.session.theme});
    }
})

app.post('/add/:title', (req,res)=>{
    const data = {
        taskName: req.params.title,
        currentIndex: array.length
    };
    array.push(data);
    res.send(data);
})

app.post('/crossOut/:id', (req,res)=>{
    let index = req.params.id;
    let obj;
    if (array[index].striked){
        obj = {striked: false};
    } else {
        obj = {striked: true};
    }
    Object.assign(array[index], obj);
    res.send(obj.striked);
});

app.post('/remove/:id', (req,res)=>{
    array.splice(req.params.id, 1)
    res.redirect('/');
});

app.post('/themeChanged', (req,res)=>{
    if (theme==='light_mode') {theme='dark_mode';}
    else {theme='light_mode';}
    res.redirect('/');
});

app.listen(port, ()=>{
    console.log(`Server starting on port ${port}.`);
});

/*
label hover backgroud color
add JS to all [theme, remove].
work space 
*/