import pool from '../config/connectDB';
let addNewTag = async(req, res) =>{
    const name = req.body.name;
    await pool.execute('INSERT INTO `tags`(`name_tag`) VALUES(?)',[name]);
    return res.status(200).json({
        message: 'add new tag done',
        status: 1
    })
}
let updateTag = async(req, res) =>{
    const name = req.body.tag_name;
    const id = req.body.tag_id;
    await pool.execute('update tags set name_tag = ? where id = ?',[name,id]);
    return res.status(200).json({
        message: 'update tag done',
        status: 1
    })
}
let getTagById = async(req, res) =>{
    const id = req.params.id;
    const [type] = await pool.execute('select * from tags where id =?', [id]);
    return res.status(200).json({
        data: type[0],
        status: 1
    })
}
let deleteTag = async(req, res) => {
    const id = req.body.id;
    const [post] = await pool.execute('select * from tags_post where tag_id = ?',[id]);
    if(post.length){
        return res.status(200).json({
            status: 2,
            message: "Không thể xóa"
        })
    }
    else{
        await pool.execute('delete from tags where id = ?',[id]);
        return res.status(200).json({
            status: 1,
            message: "Xóa thành công"
        })
    }
}
module.exports = {
    addNewTag: addNewTag,
    updateTag: updateTag,
    getTagById: getTagById,
    deleteTag: deleteTag
}