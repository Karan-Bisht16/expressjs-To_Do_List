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