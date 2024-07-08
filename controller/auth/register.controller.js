import pool from '../../config/connectDB';
import bcrypt from "bcryptjs";
exports.register = async (req, res) => {
    try{
        let data = {
            fullname: req.body.fullname,
            email: req.body.email,
            pass: req.body.password
        };
        console.log(data);
        //create a new user
        await createNewuser(data.email, data.pass,data.fullname);
        return res.status(200).json({
            message: "a user create succeeds"
        })
    }catch (e) {
        return res.status(500).json(e);
    }
}

const createNewuser = (email, pass, fullname) => {
    const role = 0;
    pool.query(
        'INSERT INTO `user1` (`email`, `pass`, `fullname`,`role`) VALUES (?, ? ,?, ?)',[email,pass,fullname,role],
        function (err, results, fields) {
            if(err){
                console.log(err);
            }
        }
      );
    
    // let check =  await checkEmailUser(email);
    // if (check === false){
         
   
    
   

}

let checkEmailUser =   (email) => {
return new Promise((resolve, reject) => {
    try{
        // let [user] = pool.execute('Select * from user1 where email = ? ', [email]);
        // if(!user.length){
        //     resolve(true);
        // }
        // resolve(false);
        pool.query("SELECT * from user1 where email = ?", email, function(error, rows) {
            if(error) reject(error);
            if(rows.length > 0) resolve(true);
            resolve(false);
        })
    }catch (e) {
        reject(e);
    }
}) ;
};