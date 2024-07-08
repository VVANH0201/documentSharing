import pool from '../config/connectDB';
let getPostById = async (req, res) => {
    let id = req.params.id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM posts where id = ?',[id]);

    return res.status(200).json({
        message: 'ok',
        data: rows[0]
    })
}
let updateViewCount= async (req, res) => {
    let post_id = req.body.id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM posts where id = ?',[post_id]);
    const new_view_count = rows[0].view_count + 1;
    await pool.execute('update posts set view_count = ? where id = ?',[new_view_count, post_id]);
    console.log(req.body);
    return res.status(200).json({
        message: 'update view_count ok',
        data: post_id
    })
}
let getPostByUserId = async (req, res) =>{
    let id = req.params.id;
    const [rows] = await pool.execute('select * from posts where user_id = ? and is_active = 1', [id]);
    return res.status(200).json({
        message: 'ok',
        data: rows.length
    })
}
let getType = async(req, res) =>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('SELECT tags.name_tag, tag_id FROM `tags_post` INNER JOIN tags on tags.id = tags_post.tag_id WHERE post_id = ?',[id]);

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}

let getAllType = async(req, res) =>{
    const [rows, fields] = await pool.execute('SELECT * from tags');

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}
let deletePost = async(req, res) =>{
    const id = req.params.id;
    const [tags] = await pool.execute('select * from tags_post where post_id = ?',[id]);
  //const length = tags.length;
     if(tags.length){
    tags.forEach( async element => {
      await pool.execute('delete from tags_post where post_id = ?',[id]);
    });
  }
    await pool.execute('update posts set is_active = 2 where id = ?',[id]);
    return res.status(200).json({
        message: 'del ok',
       
    })
}
let search_post = async(req, res) =>{
    var search_query = req.query.search_query;
    var query = `
        SELECT posts.id, posts.title FROM posts 
        WHERE title LIKE LOWER('%${search_query}%') 
        and is_active = 1
        LIMIT 10
    `;
    let [posts] = await pool.execute(query);
    return res.status(200).json({
        message: 'search ok',
        data: posts
    });
}
let mostPotByViewCount = async(req, res) =>{
    //let id = req.params.id;
    let [posts] = await pool.execute('SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.view_count, posts.created_at, posts.images, users.full_name FROM `posts` inner join users on users.id = posts.user_id WHERE posts.is_active = 1 ORDER BY posts.view_count DESC LIMIT 12  ')
    return res.status(200).json({
        message: 'mostPostByVewCount',
        data: posts
    });
}
let getPostByTime = async(req, res) =>{
    let [posts] = await pool.execute('SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.view_count, posts.created_at, posts.images, users.full_name FROM `posts` inner join users on users.id = posts.user_id WHERE posts.is_active = 1 ORDER BY posts.created_at DESC LIMIT 5  ')
    return res.status(200).json({
        message: 'getPostByTime',
        data: posts
    });
}
let getPostByTag = async(req, res) =>{
    try {
        const tag = req.body.tag;

        // Kiểm tra xem tag có phải là một mảng và không rỗng
        if (!Array.isArray(tag) || tag.length === 0) {
            return res.status(400).json({ error: 'Tag must be a non-empty array' });
        }

        const placeholders = tag.map(() => '?').join(',');

        const query = `
            SELECT DISTINCT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.view_count, posts.created_at, posts.images, users.full_name 
            FROM posts 
            INNER JOIN users ON users.id = posts.user_id 
            INNER JOIN tags_post ON tags_post.post_id = posts.id 
            WHERE posts.is_active = 1 AND tags_post.tag_id IN (${placeholders}) LIMIT 5
        `;

        const [post] = await pool.execute(query, tag);
        
        return res.status(200).json({
            message: 'done',
            data: post
        });   
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
let publicPost = async(req, res) =>{
    const id = req.body.id;
    await pool.execute('update posts set is_active = 1 where id = ?',[id]);
    return res.status(200).json({
        message: 'set public posts'
    });   

}
let privatePost = async(req, res) =>{
    const id = req.body.id;
    await pool.execute('update posts set is_active = 3 where id = ?',[id]);
    return res.status(200).json({
        message: 'set private posts'
    });   

}
let findPost = async(req, res) =>{
    const kw = req.query.kw;
    let kw1 = '%' + kw + '%';
    let [posts] = await pool.execute('SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.view_count, posts.created_at, posts.images, users.full_name FROM `posts` inner join users on users.id = posts.user_id WHERE LOWER(title) LIKE LOWER(?) and  posts.is_active = 1 ORDER BY posts.created_at DESC   ',[kw1])
    return res.status(200).json({
        message: 'ok',
        data: posts,
        length: posts.length
    })
} 
module.exports = {
    getPostById: getPostById,
    getType: getType,
    getAllType: getAllType,
    deletePost: deletePost,
    search_post: search_post,
    getPostByUserId:getPostByUserId,
    updateViewCount:updateViewCount,
    mostPotByViewCount: mostPotByViewCount,
    getPostByTime: getPostByTime,
    publicPost: publicPost,
    privatePost: privatePost,
    getPostByTag: getPostByTag,
    findPost: findPost
}