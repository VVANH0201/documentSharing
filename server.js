import  express  from "express";
import configViewEngine from "./config/viewEngine";
import initWebRouter from "./routers/web";
import initAPItest from "./routers/api";
import initAuth from "./routers/auth";
import session from "express-session";
const expressLayout = require('express-ejs-layouts');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
import pool from './config/connectDB';
require("dotenv").config
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.json());

//config view engine
configViewEngine(app);
app.use(express.static('public'));
//app.use(expressLayout);
//app.set('layout', './layouts/main');
 //app.set("views", "./views");
//app.set('view engine', 'ejs');
//init web routes
// initWebRouter(app);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
 }));
const moment = require("moment");

app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });
initAPItest(app);
initAuth(app);
app.use('/', require('./routers/web'))
const PORT = 8001;
app.listen(PORT, () =>{
    console.log(">>> ss backend on port: "+ PORT);
})
