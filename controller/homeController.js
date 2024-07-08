import userService from "../service/userService"
const handleHelloWorld = (req, res) =>{
    return res.render("home.ejs");
}
const handleUser =  (req, res) =>{
    let userList =   userService.getUserList();
    return res.render("user.ejs");
}
const handlCreateUser = (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    userService.createNewuser(email, password,username);
    
    return res.render("user.ejs");
    

}
module.exports = {
    handleHelloWorld,handleUser,handlCreateUser
}