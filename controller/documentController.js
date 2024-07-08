import pool from '../config/connectDB';
let updateDownloadCount= async (req, res) => {
    let document_id = req.body.id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM document where id = ?',[document_id]);
    const new_download_count = rows[0].download_count + 1;
    await pool.execute('update document set download_count = ? where id = ?',[new_download_count, document_id]);

    return res.status(200).json({
        message: 'update download_count ok',
        data: rows
    })
}
let getDocumentById = async(req, res) =>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('SELECT * FROM document where id = ?',[id]);
    return res.status(200).json({
        message: 'ok',
        data: rows[0]
    })
}
let getDocumentByUserId = async(req, res) =>{
    let id = req.params.id;
    const [rows] = await pool.execute('select * from document where user_id = ? and is_active = 1',[id]);
    return res.status(200).json({
        message: 'ok',
        data: rows.length
    })
}

let updateViewCount= async (req, res) => {
    let document_id = req.body.id;
    //http
    // 404 501
    // json/xml => object
    const [rows, fields] = await pool.execute('SELECT * FROM document where id = ?',[document_id]);
    const new_view_count = rows[0].view_count + 1;
    await pool.execute('update document set view_count = ? where id = ?',[new_view_count, document_id]);
    console.log(req.body);
    return res.status(200).json({
        message: 'update view_count ok',
        data: document_id
    })
}
let getAllTypes = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM types where parent_id IS NULL' );

    return res.status(200).json({
        message: 'ok',
        data: rows
    })
}
let getdocumentbyview = async(req, res) =>{
    const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where  document.is_active = 1 ORDER BY document.view_count DESC LIMIT 8 ');
    return res.status(200).json({
        message: 'ok',
        data: rows,
        length: rows.length
    })
}
let getDocumentByType = async(req, res) =>{
    console.log(req.body);
    const id = req.query.id;
    const vt = req.query.vt || 'view';
    const limit = req.query.limit || "10";
    if(vt === 'view'){
        const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where document.type_id = ? and document.is_active = 1 ORDER BY document.view_count DESC LIMIT ?',[id, limit]);
        return res.status(200).json({
            data: rows
            
        })
    }
    else{
        const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where document.type_id = ? and document.is_active = 1 ORDER BY document.created_at DESC LIMIT ?',[id, limit]);
        return res.status(200).json({
            data: rows
            
        })
    }
    
}
let documentByTimes = async(req, res) =>{
    const limit = req.query.limit || "10";
    const vt = req.query.vt || 'view';
    if(vt === 'view'){
        const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where document.is_active = 1 ORDER BY document.view_count DESC LIMIT ?',[limit]);
        return res.status(200).json({
            data: rows
            
        })
    }
    else{
        const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where document.is_active = 1 ORDER BY document.created_at DESC LIMIT ?',[limit]);
        return res.status(200).json({
            data: rows
            
        })
    }
    
    
}

let getDocumentByUsers = async(req, res) =>{
    
    const id = req.query.id;
    const limit = req.query.limit || "5";
    
    const [rows, fields] = await pool.execute('SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where document.user_id = ? and document.is_active = 1 ORDER BY document.created_at DESC LIMIT ?',[id, limit]);
    return res.status(200).json({
        data: rows,
        message: "done"
        
    })
}
let getdocumentbytime = async(req, res) =>{
    const [rows, fields] = await pool.execute('SELECT document.id,document.user_id, document.title, document.link,document.like_count,document.describes, document.view_count, document.download_count, document.data_text, document.created_at, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where  document.is_active = 1 ORDER BY document.created_at DESC LIMIT 8');
    return res.status(200).json({
        message: 'ok',
        data: rows,
        length: rows.length
    })
}
let find = async (req, res) =>{
    const name =  req.query.name;
    const sort = req.query.sort || 'created_at';
    const type = req.query.type || '';
    if(type){
        let name1 = '%' + name + '%';
        const [rows, fields] = await pool.execute(`SELECT document.id,document.user_id, document.title, document.link, document.view_count, document.download_count,document.like_count, document.data_text,document.img, document.created_at, document.file_type, document.is_active, users.full_name, users.avatar_url FROM document INNER join users on document.user_id = users.id where LOWER(title) LIKE LOWER(?) and document.is_active = 1 and document.type_id = ${type} ORDER BY document.${sort} DESC` ,[name1]);
        return res.status(200).json({
            message: 'ok',
            data: rows,
            length: rows.length
        })
    }
    else{
        console.log(sort);
        let name1 = '%' + name + '%';
        const [rows, fields] = await pool.execute(`SELECT document.id,document.user_id, document.title, document.link, document.view_count, document.download_count,document.like_count, document.data_text,document.img, document.created_at, document.file_type, document.is_active, users.full_name, users.avatar_url FROM document INNER join users on document.user_id = users.id where LOWER(title) LIKE LOWER(?) and document.is_active = 1 ORDER BY document.${sort} DESC` ,[name1]);
        return res.status(200).json({
            message: 'ok',
            data: rows,
            length: rows.length
        })
    }
}
let deleteDocument = async(req, res) =>{
    const id = req.params.id;
    console.log("id:" + id);
    await pool.execute('update document set is_active = 2 where id = ?', [id]);

    return res.status(200).json({
        message: 'del ok',
        //data: rows,
        //length: rows.length
    })
}
let search_document = async(req, res) =>{
    var search_query = req.query.search_query;
    var query = `
        SELECT document.id, document.title FROM document 
        WHERE title LIKE LOWER('%${search_query}%') 
        and is_active = 1
        LIMIT 10
    `;
    let [document] = await pool.execute(query);
    return res.status(200).json({
        message: 'search ok',
        data: document
    });
}
let publicDocument = async(req, res) =>{
    const id = req.body.id;
    await pool.execute('update document set is_active = 1 where id = ?',[id]);
    return res.status(200).json({
        message: 'set public document'
    });   

}
let privateDocument = async(req, res) =>{
    const id = req.body.id;
    await pool.execute('update document set is_active = 3 where id = ?',[id]);
    return res.status(200).json({
        message: 'set private document'
    });   

}
module.exports = {
    updateDownloadCount: updateDownloadCount,
    updateViewCount: updateViewCount,
    getAllTypes: getAllTypes,
    find: find,
    getdocumentbyview: getdocumentbyview,
    getdocumentbytime:getdocumentbytime,
    getDocumentById:getDocumentById,
    getDocumentByType: getDocumentByType,
    deleteDocument: deleteDocument,
    search_document: search_document,
    getDocumentByUserId:getDocumentByUserId,
    publicDocument: publicDocument,
    privateDocument: privateDocument,
    getDocumentByUsers:getDocumentByUsers,
    documentByTimes:documentByTimes
}