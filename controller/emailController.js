const nodemailer = require("nodemailer");
import pool from '../config/connectDB';
import bcrypt from "bcryptjs";
var appRoot = require('app-root-path');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);
const hashPassword = (password)=>{
    let hashPass = bcrypt.hashSync(password,salt);
    return hashPass;
}
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}
let sendemail = async (email) => {
    const [user] = await pool.execute('select id, password from users where email = ?',[email]);
    //if(user)
    const user_id = user[0].id;
    let newpass = generateRandomString();
    console.log(newpass);
    
    //let password = user[0].password;
    let hashPass = hashPassword(newpass);
    await pool.execute('update users set password = ? where id =?',[hashPass,user_id]);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "anhanhkshb0201@gmail.com",
          pass: "oubykgczaiicexfp",
        },
    });
    const info = await transporter.sendMail({
        from: '"Chia sẻ tài liệu" <anhanhkshb0201@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Mật khẩu mới của bạn", // Subject line
        text: newpass, // plain text body
        html: `<b>Mật khẩu mới của bạn là: ${newpass}</b>`, 
        // html body
    });
    return info;
}

let down = async(path,email) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "anhanhkshb0201@gmail.com",
          pass: "oubykgczaiicexfp",
        },
    });
    const info = await transporter.sendMail({
        from: '"Chia sẻ tài liệu" <anhanhkshb0201@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Tài liệu", // Subject line
        text: 'Cảm cơn bạn dã sử dụng website của chúng tôi', // plain text body
        html: `<b>Tài liệu được đính kèm ở dưới!</b>`, 
        attachments:[
            {   // filename and content type is derived from path
                path: path
            },
        ]
        // html body
    });
    return info;
}
let send = async(req, res) =>{
    try {
        const email = req.body.email;
        const [users] = await pool.execute('select email from users where email =?',[email]);
        if(users[0]){
            const response = await sendemail(email);
            return res.status(200).json({
                message: 'Mật khẩu mới của bạn đã được gửi về email. Hãy kiểm tra email để lấy mật khẩu mới',
                data: response
            });
        }
        return res.status(200).json({
            message: 'Không có tài khoản có email '+email
        })
        
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: 'err'
        })
    }
}
let downloadFile = async(req, res) =>{
    try {
        const id = req.body.id;
        const document_id = req.body.document_id;
        const path = req.body.path;
        const filepath = appRoot + "/public/img/"+ path;
        const [users] = await pool.execute('select email from users where id =?',[id]);
        if(users[0]){
            const response = await down(filepath, users[0].email);
            const [rows, fields] = await pool.execute('SELECT * FROM document where id = ?',[document_id]);
            const new_download_count = rows[0].download_count + 1;
            await pool.execute('update document set download_count = ? where id = ?',[new_download_count, document_id]);
            return res.status(200).json({
                message: 'Tài liệu đã được gửi về email của bạn. Hãy kiểm tra email.',
                data: response
            });
        }
        return res.status(200).json({
            message: 'Không có tài khoản có email '+email
        })
        
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: 'err'
        })
    }
}
module.exports = {
   send: send,
   downloadFile: downloadFile
}