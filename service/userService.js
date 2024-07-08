import bcrypt from "bcryptjs"
import mysql from "mysql2"
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
// Create the connection to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123123",
    database: "testdatabase"
})

const hashPassword = (password)=>{
    let hashPass = bcrypt.hashSync(password,salt);
    return hashPass;
}


const createNewuser = (email, password, username) => {
    let hashPass = hashPassword(password);
    connection.query(
        'INSERT INTO `users` (`email`, `pass`, `username`) VALUES (?, ? ,?)',[email,hashPass,username],
        function (err, results, fields) {
            if(err){
                console.log(err);
            }
        }
      );

}

const getUserList = () => {
    let user =[];
    connection.query(
        'SELECT * FROM users',
        function (err, results, fields) {
            if(err){
                console.log(err);
                return user;
            }
            user = results;
            return user;
        }
      );
}
module.exports = {
    createNewuser, getUserList
}
