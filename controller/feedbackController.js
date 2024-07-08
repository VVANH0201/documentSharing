import pool from '../config/connectDB';
let addNewFeedBack = async(req, res) =>{
    const content = req.body.content;
    const user_id = req.body.user_id;
    console.log(req.body);
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('INSERT INTO `feedback`(`user_id`,`content`,`created_at`) VALUES(?,?,?)',[user_id,content,vntime]);
    return res.status(200).json({
        message: 'add new feedback done',
        status: 1
    });
}
let deleteFeedBack = async(req, res) =>{
    const id = req.body.id;
    await pool.execute('delete from feedback where id = ?',[id]);
    return res.status(200).json({
        message: 'delete tag done',
        status: 1
    })
}

module.exports = {
    addNewFeedBack: addNewFeedBack,
    deleteFeedBack: deleteFeedBack
}