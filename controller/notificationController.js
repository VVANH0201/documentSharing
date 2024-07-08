import pool from '../config/connectDB';
let getAllNotification = async (req, res) => {
    let user_id = req.params.user_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT notifications.id, notifications.own_id, notifications.user_id, notifications.content, notifications.created_at, notifications.link, users.full_name, users.avatar_url FROM `notifications` INNER JOIN users on notifications.user_id = users.id WHERE notifications.own_id = ? and notifications.is_active = 1 ORDER BY notifications.created_at DESC LIMIT 5',[user_id]);

    return res.status(200).json({
        message: 'ok',
        data: rows,
        num: rows.length
    })
}
let getallNotiAdmin = async(req, res) =>{
    let user_id = req.params.user_id;
    const [rows, fields] = await pool.execute('SELECT notifications.id, notifications.own_id, notifications.content, notifications.created_at FROM `notifications` WHERE notifications.own_id = ? and notifications.is_active = 1 and notifications.user_id IS NULL ORDER BY notifications.created_at DESC LIMIT 5',[user_id]);

    return res.status(200).json({
        message: 'ok',
        data: rows,
        num: rows.length
    })
}
let updatenoti = async(req, res) =>{
    let id = req.body.id;
    await pool.execute("UPDATE `notifications` SET is_active = 2 where id = ? ",[id]);
    return res.status(200).json({
        message: 'update done',
        
    })
}
module.exports = {
    getAllNotification: getAllNotification,
    updatenoti: updatenoti,
    getallNotiAdmin: getallNotiAdmin
}
