import connection from "../config/connectDB"
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
const hashPassword = (password)=>{
    let hashPass = bcrypt.hashSync(password,salt);
    return hashPass;
}
let checkEmailUser = async (req, res) => {
        //const email = req.body;
        const sql = 'SELECT * FROM `users` WHERE `email` = ? ';
        const values = ['email@gmail.com'];
         await connection.execute(sql, values, (err, rows, fields) => {
            if (err instanceof Error) {
              console.log(err);
              return;
            }
            // if(rows.length > 0){
            //     return res.status(200).json({
            //         email: email
            //     })
            // }
            // else{
            //     return res.status(200).json({
            //         message: 'none'
            //     })
            // }
            console.log(rows);
            console.log(fields);
          });
};
let resetpass = async(req, res) =>{
    let {oldpass, newpass} = req.body;
    let id =  req.session.user.id;
    const [rows, fields] = await connection.execute('select * from users where id = ?',
    [id]);
    if(rows[0]){
        let match = await bcrypt.compare(oldpass, rows[0].password);
        if(match){
            // req.session.loggedin = true;
            // req.session.user = rows[0];
            let hashPass = hashPassword(newpass);
            await connection.execute('update users set password = ? where id = ?',
            [ hashPass,id]);
            req.session.destroy();
            return res.status(200).json({
                check: 1,
                data: rows[0],
                message: 'reset done'
            })
        }
        return res.status(200).json({
            check : 0,
            data: rows[0],
            message: 'password not'
        })

    }
    return res.status(200).json({
        check : 0,
        //data: rows[0],
        message: 'pass not'
    })

    
}
let register = async (req, res) => {
    let { email, password, full_name } = req.body;
    //let check = 0;
    if (!password || !full_name || !email ) {
        return res.status(200).json({
            message: 'missing required params'
        })
    }
    const [rows, fields] = await connection.execute('select * from users where email = ?',
        [email]);
    if(rows[0]){
        return res.status(200).json({
            check: 1,
            data: rows[0],
            message: 'da co data'
        })
    }
    let hashPass = hashPassword(password);
    const currentDate = new Date();
    const avatar_url = 'user.jpg';
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await connection.execute('insert into users(email, password, full_name,avatar_url,is_active,role, created_at) values ( ?, ?, ?,?,?,?,?)',
        [email, hashPass, full_name,avatar_url,1,1,vntime]);

    return res.status(200).json({
        check: 2,
        //data: rows[0],
        message: 'ok'
    })
        //create a new user
        //await createNewUser(data);
  };
  let login = async (req, res) => {
    let { email, password } = req.body;
    
    if (!password || !email) {
        return res.status(200).json({
            message: 'missing required params'
        })
    }
    const [rows, fields] = await connection.execute('select * from users where email = ?',
        [email]);
    if(rows[0]){
        let match = await bcrypt.compare(password, rows[0].password);
        if(match){
            req.session.loggedin = true;
            req.session.user = rows[0];
            return res.status(200).json({
                check: 1,
                data: rows[0],
                message: 'login done'
            })
        }
        return res.status(200).json({
            check : 0,
            data: rows[0],
            message: 'Mật khẩu của bạn không chính xác'
        })
    }
    return res.status(200).json({
        check : 0,
        //data: rows[0],
        message: 'Email của bạn không chính xác'
    })
        //create a new user
        //await createNewUser(data);
  };

module.exports = {
    checkEmailUser : checkEmailUser,
    //createNewUser: createNewUser,
    register: register,
    login: login,
    resetpass: resetpass
    //changefile: changefile
};