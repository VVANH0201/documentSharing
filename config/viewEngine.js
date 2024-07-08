import  express  from "express";
/**
 * 
 * @param {*} app 
 */
const configViewEngine = (app) =>{
    
    //app.use(express.static('./public'));
    app.set("view engine", "ejs");
    //app.set('layout', './views/layouts/main');
    app.set("views", "./views");

}

export default configViewEngine;