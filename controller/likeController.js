import pool from '../config/connectDB';
// get all like by user_id
let getAllLikeByUser = async (req, res) => {
    let user_id = req.params.user_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM likes where user_id = ?',[user_id]);

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}
//get all like by document_id
let getAllLikeOfDocument = async (req, res) => {
    let document_id = req.params.document_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM likes where document_id = ?',[document_id]);

    return res.status(200).json({
        message: 'ok',
        count: rows.length,
        data: rows
    })
}
// get all like by post_id
let getAllLikeOfPost = async (req, res) => {
    let post_id = req.params.post_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM likes where post_id = ?',[post_id]);

    return res.status(200).json({
        message: 'ok',
        count: rows.length,
        data: rows
    })
}
let getAllLikeOfComment = async (req, res) => {
    let comment_id = req.params.comment_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM likes where comment_id = ?',[comment_id]);

    return res.status(200).json({
        message: 'ok',
        count: rows.length,
        data: rows
    })
}
//insert like
//Kiem tra xem nguoi dung da like document chua
//Neu chua thuc hien them moi du lieu
//Neu roi thi update thuoc tinh is_active
let likeDocument = async (req, res) => {
    let user_id = req.body.user_id;
    let document_id = req.body.document_id;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã thích tài liệu của bạn";
    let link = "/user/" + user_id;
    console.log(req.body);
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    //check liked
    const [rows, fields] = await pool.execute('SELECT * FROM likes where user_id = ? AND document_id = ?',[user_id, document_id]);
    let [document, field] = await pool.execute('SELECT * FROM document where user_id = ? AND id = ?',[own_id, document_id]);
    if(rows[0]){
        // da like
        let is_active = rows[0].is_active;
        if(is_active === 1){
            await pool.execute('update likes set is_active = 2 where user_id = ? AND document_id = ?',[user_id, document_id]);
            let new_count = document[0].like_count - 1;
            await pool.execute('update document set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, document_id]);
            return res.status(200).json({
                message: 'unlike'
            })
        }
        else{
            await pool.execute('update likes set is_active = 1 where user_id = ? AND document_id = ?',[user_id, document_id]);
            
            let new_count = document[0].like_count + 1;
            await pool.execute('update document set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, document_id]);
            await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);
            return res.status(200).json({
                message: 'like'
            })
        }
       
    }
    else{
        //chua like

        await pool.execute('insert into likes (user_id, document_id, created_at, is_active) values (?,?,?,?) ',[user_id, document_id, vntime, 1]);
        let new_count = document[0].like_count + 1;
        await pool.execute('update document set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, document_id]);
        await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);
        return res.status(200).json({
            message: 'like'
        })
    }
}
let likePost = async (req, res) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã thích bài viết của bạn";
    let link = "/user/" + user_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    //check liked
    const [rows, fields] = await pool.execute('SELECT * FROM likes where user_id = ? AND post_id = ?',[user_id, post_id]);
    let [post, field] = await pool.execute('SELECT * FROM posts where user_id = ? AND id = ?',[own_id, post_id]);
    if(rows[0]){
        // da like
        let is_active = rows[0].is_active;
        if(is_active === 1){
            await pool.execute('update likes set is_active = 2 where user_id = ? AND post_id = ?',[user_id, post_id]);
            let new_count = post[0].like_count - 1;
            await pool.execute('update posts set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, post_id]);
            return res.status(200).json({
                message: 'unlike post'
            })
            
        }
        else{
            await pool.execute('update likes set is_active = 1 where user_id = ? AND post_id = ?',[user_id, post_id]);
            let new_count = post[0].like_count + 1;
            await pool.execute('update posts set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, post_id]);
            await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);
            return res.status(200).json({
                message: 'like post'
            })
        }
       
    }
    else{
        //chua like
        await pool.execute('insert into likes (user_id, post_id, created_at, is_active) values (?,?,?,?) ',[user_id, post_id, vntime, 1]);
        let new_count = post[0].like_count + 1;
        await pool.execute('update posts set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, post_id]);
        await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);

        return res.status(200).json({
            message: 'like post'
        })
    }
}
let likeComment = async (req, res) => {
    let user_id = req.body.user_id;
    let comment_id = req.body.comment_id;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã thích bình luận của bạn";
    let link = "/user/" + user_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    //check liked
    const [rows, fields] = await pool.execute('SELECT * FROM likes where user_id = ? AND comment_id = ?',[user_id, comment_id]);
    let [comment, field] = await pool.execute('SELECT * FROM comments where user_id = ? AND id = ?',[own_id, comment_id]);
    if(rows[0]){
        // da like
        let is_active = rows[0].is_active;
        if(is_active === 1){
            await pool.execute('update likes set is_active = 2 where user_id = ? AND comment_id = ?',[user_id, comment_id]);
            let new_count = comment[0].like_count - 1;
            await pool.execute('update comments set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, comment_id]);
            return res.status(200).json({
                message: 'unlike comment'
            })
        }
        else{
            await pool.execute('update likes set is_active = 1 where user_id = ? AND comment_id = ?',[user_id, comment_id]);
            let new_count = comment[0].like_count + 1;
            await pool.execute('update comments set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, comment_id]);
            await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);
            return res.status(200).json({
                message: 'like comment'
            })
        }
       
    }
    else{
        //chua like
        await pool.execute('insert into likes (user_id, comment_id, created_at, is_active) values (?,?,?,?) ',[user_id, comment_id, vntime, 1]);
        let new_count = comment[0].like_count + 1;
        await pool.execute('update comments set like_count = ? where user_id = ? AND id = ?', [new_count, own_id, comment_id]);
        await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);

        return res.status(200).json({
            message: 'like comment'
        })
    }
}
module.exports = {
    getAllLikeByUser: getAllLikeByUser,
    getAllLikeOfDocument: getAllLikeOfDocument,
    getAllLikeOfPost: getAllLikeOfPost,
    getAllLikeOfComment: getAllLikeOfComment,
    likeDocument: likeDocument,
    likePost: likePost,
    likeComment: likeComment
}