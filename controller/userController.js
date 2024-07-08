import pool from '../config/connectDB';
const nodemailer = require("nodemailer");
let adminDelUser = async (req, res) => {
    const id = req.params.id;
    
    // // Hàm đệ quy để xóa tất cả các comment con của comment có id là id
    // const deleteChildComments = async (commentId) => {
    //     // Lấy tất cả các comment con của comment có id là commentId
    //     const [childComments] = await pool.execute('SELECT id FROM comments WHERE parent_comment_id = ?', [commentId]);
        
    //     // Xóa tất cả các comment con của comment đó
    //     for (const childComment of childComments) {
    //         await deleteChildComments(childComment.id);
    //         await pool.execute('update  comments set is_active = 2 WHERE id = ?', [childComment.id]);
    //     }
    // };
    
    // // Xóa tất cả các comment con của comment có id là id
    // await deleteChildComments(id);
    
    // Xóa comment có id là id
    await pool.execute('update  users set is_active = 2 WHERE id = ?', [id]);
    
    return res.status(200).json({
        message: 'delete ok'
    });
};
let searchUser = async(req, res) =>{
    var search_query = req.query.search_query;
    var query = `
        SELECT users.full_name, users.id FROM users 
        WHERE full_name LIKE LOWER('%${search_query}%') 
        and is_active = 1
        LIMIT 10
    `;
    let [users] = await pool.execute(query);
    return res.status(200).json({
        message: 'delete ok',
        data: users
    });
}
let lock_account = async(email) =>{
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
        subject: "Tài khoản của bạn đã bị khóa", // Subject line
        text: '', // plain text body
        html: `<b>Tài khoản của bạn đã bị khóa. Vui lòng gửi khiếu nại đến email: anhanhkshb0201@gmail.com để được hỗ trợ. Xin cảm ơn</b>`, 
        // html body
    });
    return info;
}
let accountLockout = async(req, res) =>{
    const id= req.body.id;
    const [user] = await pool.execute('select email from users where id =?',[id]);
    await pool.execute('update users set is_active = 3 where id = ?',[id]);
    const response = await lock_account(user[0].email);
    return res.status(200).json({
        message: 'accountLockout done',
       data: response
    });
}
let unAccountLockout = async(req, res) =>{
    const id= req.body.id;
    await pool.execute('update users set is_active = 1 where id = ?',[id]);
    return res.status(200).json({
        message: 'unAccountLockout done',
       
    });
}
let findUser = async(req, res) =>{
    const kw = req.query.kw;
    let kw1 = '%' + kw + '%';
    const [user, fields] = await pool.execute(`SELECT * FROM users where LOWER(full_name) LIKE LOWER(?) and users.is_active = 1 and role = 1 ORDER BY users.full_name DESC` ,[kw1]);
    return res.status(200).json({
        message: 'ok',
        data: user,
        length: user.length
    })
}
module.exports = {
    adminDelUser:adminDelUser,
    searchUser:searchUser,
    accountLockout: accountLockout,
    unAccountLockout: unAccountLockout,
    findUser: findUser
}