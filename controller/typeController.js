import pool from '../config/connectDB';
let addNewType = async(req, res) =>{
    const name = req.body.name;
    await pool.execute('INSERT INTO `types`(`name`) VALUES(?)',[name]);
    return res.status(200).json({
        message: 'add new types done',
        status: 1
    })
}
let updateType = async(req, res) =>{
    const name = req.body.type_name;
    const id = req.body.type_id;
    await pool.execute('update types set name = ? where id = ?',[name,id]);
    return res.status(200).json({
        message: 'update types done',
        status: 1
    })
}
let getTypeById = async(req, res) =>{
    const id = req.params.id;
    const [type] = await pool.execute('select * from types where id =?', [id]);
    return res.status(200).json({
        data: type[0],
        status: 1
    })
}
let gettypeByParentId = async(req, res) =>{
    const parentId = req.params.parentId;
    const [type] = await pool.execute('select * from types where parent_id =?', [parentId]);
    return res.status(200).json({
        data: type,
        status: 1
    })
}
let deleteType = async(req, res) => {
    const id = req.body.id;
    const [document] = await pool.execute('select * from document where type_id = ?',[id]);
    if(document.length){
        return res.status(200).json({
            status: 2,
            message: "Không thể xóa"
        })
    }
    else{
        await pool.execute('delete from types where id = ?',[id]);
        return res.status(200).json({
            status: 1,
            message: "Xóa thành công"
        })
    }
}
let statisticTypeDocumentByUserId = async(req, res) =>{
    const id = req.body.id; 
    console.log(id);
    const[data] = await pool.execute(`WITH TopTypes AS (
        SELECT 
            t.name AS type_name,
            COUNT(d.id) AS document_count,
            ROW_NUMBER() OVER (ORDER BY COUNT(d.id) DESC) AS type_rank
        FROM 
            types t
        LEFT JOIN 
            document d ON t.id = d.type_id
    WHERE d.user_id = ?
        GROUP BY 
            t.id, t.name
    )
    SELECT 
        CASE WHEN type_rank <= 3 THEN type_name ELSE 'other' END AS type_group,
        SUM(document_count) AS total_documents
    FROM 
        TopTypes
    GROUP BY 
        CASE WHEN type_rank <= 3 THEN type_name ELSE 'other' END
    ORDER BY 
        total_documents DESC;`,[id]);
    return res.status(200).json({
        message: 'get data ok',
        data: data
    });
}
module.exports = {
    addNewType: addNewType,
    updateType: updateType,
    getTypeById: getTypeById,
    deleteType: deleteType,
    gettypeByParentId: gettypeByParentId,
    statisticTypeDocumentByUserId:statisticTypeDocumentByUserId
}