import pool from '../config/connectDB';
let addNew = async (req, res) => {

    const following_user_id = req.body.following_user_id;
    const followed_user_id =  req.body.followed_user_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[following_user_id]);
    //const [user_ed] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[followed_user_id]);
    await pool.execute('insert into follows (following_user_id, followed_user_id) values (?,?)',
    [following_user_id, followed_user_id]);
    let text = "Bạn có người theo dõi mới: "+ user_ing[0].full_name;
    let link = "/user/" + following_user_id;
    await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[followed_user_id,following_user_id, text,vntime,link,1]);

    return res.status(200).json({
        message: 'ok',
        
    })
}

let deleteFollow = async (req, res) => {

    const following_user_id = req.body.following_user_id;
    const followed_user_id =  req.body.followed_user_id;
   
    await pool.execute('delete from follows where following_user_id = ? and  followed_user_id = ? ',
    [following_user_id, followed_user_id]);

    return res.status(200).json({
        message: ' del ok',
        
    })
}
let checkfollows = async(req, res) => {
    const following_user_id = req.body.following_user_id;
    const followed_user_id =  req.body.followed_user_id;
    console.log(req.body); 
    const [rows, fields] = await pool.execute('SELECT * FROM follows where following_user_id = ? and followed_user_id = ?',[following_user_id, followed_user_id] );
    return res.status(200).json({
        message: 'ok',
        data: rows[0]
    })
}
// dem so nguoi id dang theo doi
let countfollow = async(req, res) =>{
    const id = req.params.id;
    const [rows, fields] = await pool.execute('SELECT follows.followed_user_id, users.full_name FROM `follows` INNER JOIN users on users.id = follows.followed_user_id WHERE following_user_id = ?',[id]);
    return res.status(200).json({
        message: 'ok',
        data: rows,
        num: rows.length
    })

}
//so nguoi theo doi id
let countfollow1 = async(req, res) =>{
    const id = req.params.id;
    const [rows, fields] = await pool.execute('SELECT follows.following_user_id, users.full_name FROM `follows` INNER JOIN users on users.id = follows.following_user_id WHERE followed_user_id = ?', [id]);
    return res.status(200).json({
        message: 'ok',
        data: rows,
        num: rows.length
    })
}
module.exports = {
    addNew: addNew,
    deleteFollow: deleteFollow,   
    checkfollows: checkfollows,
    countfollow:countfollow,
    countfollow1: countfollow1
}