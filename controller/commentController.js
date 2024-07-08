import pool from '../config/connectDB';
let getAllCommentByUser = async (req, res) => {
    let user_id = req.params.user_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM comments where user_id = ?',[user_id]);

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}

let checkCommentByUser = async (req, res) => {
    let user_id = req.body.user_id;
    let comment_id = req.body.comment_id;
    const [rows, fields] = await pool.execute('SELECT * FROM comments where user_id = ? and id= ?',[user_id, comment_id]);
    if(rows[0]){
        return res.status(200).json({
            data: rows[0],
            message: 'ok',
            status: 1
        })
    }
    else{
        return res.status(200).json({
            status: 2,
            message: 'ok'
        })
    }
    
}

let getAllCommentOfPost = async (req, res) => {
    let post_id = req.params.post_id;
   
    const [rows, fields] = await pool.execute('SELECT comments.id, comments.user_id, comments.post_id, full_name, users.avatar_url, comments.content, comments.created_at, comments.like_count  FROM `comments` INNER JOIN users ON comments.user_id = users.id where comments.post_id = ? and comments.parent_comment_id IS NULL and comments.is_active = 1',[post_id]);
    const [rows1, fields1] = await pool.execute('SELECT comments.id, comments.user_id, comments.post_id, full_name, users.avatar_url, comments.content, comments.created_at, comments.like_count  FROM `comments` INNER JOIN users ON comments.user_id = users.id where comments.post_id = ? and comments.is_active = 1',[post_id]);
    return res.status(200).json({
        message: 'ok',
        num: rows1.length,
        data: rows
    })
}
let getAllCommentOfDocument = async (req, res) => {
    let document_id = req.params.document_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT comments.id, comments.user_id, comments.document_id, full_name, users.avatar_url, comments.content, comments.created_at, comments.like_count  FROM `comments` INNER JOIN users ON comments.user_id = users.id WHERE comments.document_id = ? and comments.parent_comment_id IS NULL and comments.is_active = 1',[document_id]);
    const [rows1, fields1] = await pool.execute('SELECT comments.id, comments.user_id, comments.document_id, full_name, users.avatar_url, comments.content, comments.created_at, comments.like_count  FROM `comments` INNER JOIN users ON comments.user_id = users.id WHERE comments.document_id = ? and  comments.is_active = 1',[document_id]);
    return res.status(200).json({
        message: 'ok',
        num: rows1.length,
        data: rows
    })
}
let getAllCommentOfComment = async (req, res) => {
    let comment_id = req.params.comment_id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT comments.id, comments.user_id, comments.document_id, full_name, users.avatar_url, comments.content, comments.created_at, comments.like_count  FROM `comments` INNER JOIN users ON comments.user_id = users.id where parent_comment_id = ? and comments.is_active = 1',[comment_id]);

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}
//Them moi comment vao bia post
let newCommentPost = async (req, res) => {
    let user_id = req.body.user_id;
    let post_id = req.body.post_id;
    let content = req.body.content;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã bình luận vào bài viết của bạn";
    let link = "/user/" + user_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('insert into comments (user_id, post_id, content, like_count, created_at, is_active) values (?,?,?,?,?,?)',
                        [user_id, post_id, content,0, vntime,1]);
    await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);


    return res.status(200).json({
        message: 'new comment in post',
        
    })
    //console.log(req.body);
}
//Them moi commnent vao document
let newCommentDocument = async (req, res) => {
    let user_id = req.body.user_id;
    let document_id = req.body.document_id;
    let content = req.body.content;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã bình luận vào tài liệu của bạn";
    let link = "/user/" + user_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('insert into comments (user_id, document_id, content, like_count, created_at, is_active) values (?,?,?,?,?,?)',
                        [user_id, document_id, content,0, vntime,1]);
    
    await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);

    return res.status(200).json({
        message: 'new comment in document',
        
    })
    //console.log(req.body);
}
let newCommentInComment = async (req, res) => {
    let user_id = req.body.user_id;
    let parent_comment_id = req.body.parent_comment_id;
    let content = req.body.content;
    let document_id = req.body.document_id;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã bình luận vào bình luận của bạn";
    let link = "/user/" + user_id;
    console.log(req.body);
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('insert into comments (user_id, parent_comment_id,document_id, content, like_count, created_at, is_active) values (?,?,?,?,?,?,?)',
                        [user_id, parent_comment_id,document_id, content,0, vntime,1]);
    
    await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);

    return res.status(200).json({
        message: 'new comment in comment',
        
    })
    //console.log(req.body);
}
let newCommentInCommentPost = async (req, res) => {
    let user_id = req.body.user_id;
    let parent_comment_id = req.body.parent_comment_id;
    let content = req.body.content;
    let post_id = req.body.post_id;
    let own_id = req.body.own_id;
    const [user_ing] = await pool.execute('SELECT full_name FROM `users` WHERE id = ? ',[user_id]);
    let text =user_ing[0].full_name+ " đã bình luận vào tài liệu của bạn";
    let link = "/user/" + user_id;
    console.log(req.body);
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute('insert into comments (user_id, parent_comment_id,post_id, content, like_count, created_at, is_active) values (?,?,?,?,?,?,?)',
                        [user_id, parent_comment_id,post_id, content,0, vntime,1]);
    
    await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[own_id,user_id, text,vntime,link,1]);

    return res.status(200).json({
        message: 'new comment in comment',
        
    })
    //console.log(req.body);
}

let deleteComment = async(req, res) => {
    let comment_id = req.body.comment_id;
    if (!comment_id) {
        return res.status(200).json({
            message: 'missing required params'
        })
    }
    let user_id =  req.body.user_id;
    const [rows, fields] = await pool.execute('SELECT * FROM comments where user_id = ? and id = ?',[user_id, comment_id]);
    if(rows.length){
        await pool.execute('update comments set is_active = ? where id = ?', [2,comment_id])
        return res.status(200).json({
            check: 2,
        message: 'del ok'
        })
    }
    else{
        
        return res.status(200).json({
            check: 1,
            message: 'Ban khong the xoa comment cua nguoi khac'
        })  
    }

}
let updateComment = async(req, res) => {
    let comment_id = req.body.comment_id;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    let content = req.body.content;
    if (!comment_id || !content) {
        return res.status(200).json({
            message: 'missing required params'
        })
    }
    await pool.execute('update comments set content = ?, updated_at = ? where id = ?', [content,vntime,comment_id])
    return res.status(200).json({
        message: 'update ok'
    })

}
const del = async(id)=>{
    await pool.execute('delete ')
}
let adminDeleteComment = async (req, res) => {
    const id = req.params.id;
    
    // Hàm đệ quy để xóa tất cả các comment con của comment có id là id
    const deleteChildComments = async (commentId) => {
        // Lấy tất cả các comment con của comment có id là commentId
        const [childComments] = await pool.execute('SELECT id FROM comments WHERE parent_comment_id = ?', [commentId]);
        
        // Xóa tất cả các comment con của comment đó
        for (const childComment of childComments) {
            await deleteChildComments(childComment.id);
            await pool.execute('update  comments set is_active = 2 WHERE id = ?', [childComment.id]);
        }
    };
    
    // Xóa tất cả các comment con của comment có id là id
    await deleteChildComments(id);
    
    // Xóa comment có id là id
    await pool.execute('update  comments set is_active = 2 WHERE id = ?', [id]);
    
    return res.status(200).json({
        message: 'delete ok'
    });
};
module.exports = {
    getAllCommentByUser: getAllCommentByUser,
    getAllCommentOfPost: getAllCommentOfPost,
    getAllCommentOfDocument: getAllCommentOfDocument,
    getAllCommentOfComment: getAllCommentOfComment,
    newCommentPost: newCommentPost,
    newCommentDocument : newCommentDocument,
    newCommentInComment: newCommentInComment,
    deleteComment: deleteComment,
    updateComment: updateComment,
    checkCommentByUser:checkCommentByUser,
    newCommentInCommentPost:newCommentInCommentPost,
    adminDeleteComment:adminDeleteComment
}

