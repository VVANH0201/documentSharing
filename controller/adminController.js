import pool from '../config/connectDB';
let statisticsByTag = async(req, res) =>{
    const sql = `WITH TopTags AS (
        SELECT 
            t.name_tag AS tag_name,
            COUNT(tp.post_id) AS post_count,
            ROW_NUMBER() OVER (ORDER BY COUNT(tp.post_id) DESC) AS tag_rank
        FROM 
            tags t
        JOIN 
            tags_post tp ON t.id = tp.tag_id
        GROUP BY 
            t.id, t.name_tag
    )
    SELECT 
        CASE WHEN tag_rank <= 3 THEN tag_name ELSE 'other' END AS tag_group,
        SUM(post_count) AS total_posts
    FROM 
        TopTags
    GROUP BY 
        CASE WHEN tag_rank <=3 THEN tag_name ELSE 'other' END
    ORDER BY 
        total_posts DESC`;
    const[tag ] = await pool.execute(sql);
    return res.status(200).json({
        message: 'get data ok',
        data: tag
    });
}
let statisticsByTypes = async(req, res) => {
    const sql = `WITH TopTypes AS (
        SELECT 
            t.name AS type_name,
            COUNT(d.id) AS document_count,
            ROW_NUMBER() OVER (ORDER BY COUNT(d.id) DESC) AS type_rank
        FROM 
            types t
        LEFT JOIN 
            document d ON t.id = d.type_id
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
        total_documents DESC;
    `;
    const[data] = await pool.execute(sql);
    return res.status(200).json({
        message: 'get data ok',
        data: data
    });
}
let newUserStatisticsForDay = async(req, res) =>{
    const sql = `SELECT 
    COUNT(*) AS total_users,
    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS new_users_today
    FROM users
    WHERE role = 1`;
    const [user] = await pool.execute(sql);
    return res.status(200).json({
        message: 'get data ok',
        data: user
    });
}
let newPostStatisticsForDay = async(req, res) => {
    const sql = `SELECT 
        COUNT(*) AS total_posts,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS new_posts_today
        FROM 
        posts;
    `;
    const [post] = await pool.execute(sql);
    return res.status(200).json({
        message: 'get data ok',
        data: post
    });

}
let newDocumentStatisticsForDay = async(req, res) =>{
    const sql = `SELECT 
    COUNT(*) AS total_documents,
    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS new_documents_today
    FROM 
    document`;
    const [document] = await pool.execute(sql);
    return res.status(200).json({
        message: 'get data ok',
        data: document
    });
}
let StatisticsForMonth = async(req, res) =>{
    const sql = `SELECT 
        COUNT(*) AS total_users,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS new_users_this_month
        FROM 
        users
        WHERE role = 1;
    `;
    const sql2 =`SELECT 
        COUNT(*) AS total_posts,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS new_posts_this_month
        FROM 
        posts;
    `;
    const sql3 = `SELECT 
        COUNT(*) AS total_docuemnts,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS new_documents_this_month
        FROM 
        document;
    `;
    const [user] = await pool.execute(sql);
    const [post] = await pool.execute(sql2);
    const [document] =await pool.execute(sql3);
    return res.status(200).json({
        message: 'get data ok',
        user: user,
        post: post,
        document: document
    });
}
let StatisticsForYear = async(req, res) =>{
    const sql = `SELECT 
        COUNT(*) AS total_users,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS new_users_this_year
        FROM 
        users
        WHERE role = 1;
    `;
    const sql2 =`SELECT 
        COUNT(*) AS total_posts,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS new_posts_this_year
        FROM 
        posts;
    `;
    const sql3 = `SELECT 
        COUNT(*) AS total_documents,
        SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS new_documents_this_year
        FROM 
        document;
    `;
    const [user] = await pool.execute(sql);
    const [post] = await pool.execute(sql2);
    const [document] =await pool.execute(sql3);
    return res.status(200).json({
        message: 'get data ok',
        user: user,
        post: post,
        document: document
    });
}
let top5User = async(req, res) =>{
    const sql = `SELECT 
                u.id AS user_id,
                u.full_name AS user_name,
                u.avatar_url AS avatar_url,
                COUNT(p.id) AS post_count
            FROM 
                users u
            LEFT JOIN 
                posts p ON u.id = p.user_id
            GROUP BY 
                u.id, u.full_name
            ORDER BY 
                post_count DESC
            LIMIT 5;
    `;
    const sql2 =`SELECT 
                u.id AS user_id,
                u.full_name AS user_name,
                u.avatar_url AS avatar_url,
                COUNT(p.id) AS document_count
            FROM 
                users u
            LEFT JOIN 
                document p ON u.id = p.user_id
            GROUP BY 
                u.id, u.full_name
            ORDER BY 
                document_count DESC
            LIMIT 5;
    `;
    const [user_post] = await pool.execute(sql);
    const [user_document] = await pool.execute(sql2);
    return res.status(200).json({
        message: 'get data ok',
        user_post: user_post,
        user_document: user_document

    });

}
let statisticsPostByMonth = async(req, res) =>{
    const year = req.body.year;
    try {
        const [post] = await pool.execute(`SELECT
                                            MONTH(created_at) AS month,
                                            COUNT(*) AS post_count
                                        FROM posts
                                        WHERE YEAR(created_at) = ?
                                        GROUP BY MONTH(created_at)

                                        UNION

                                        SELECT
                                            m AS month,
                                            0 AS post_count
                                        FROM (
                                            SELECT 1 AS m
                                            UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
                                            UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
                                        ) AS months
                                        WHERE m NOT IN (
                                            SELECT MONTH(created_at)
                                            FROM posts
                                            WHERE YEAR(created_at) = ?
                                        )
                                        ORDER BY month;`,[year, year]);
    return res.status(200).json({
        message: 'get data ok',
        post: post

    });
    } catch (error) {
        console.error(error); // Log any errors
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
}
let statisticsDocumentByMonth = async(req, res) =>{
    const year = req.body.year;
    try {
        const [post] = await pool.execute(`SELECT
        MONTH(created_at) AS month,
        COUNT(*) AS document_count
    FROM document
    WHERE YEAR(created_at) = ?
    GROUP BY MONTH(created_at)
    
    UNION
    
    SELECT
        m AS month,
        0 AS pdocument_count
    FROM (
        SELECT 1 AS m
        UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
        UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    WHERE m NOT IN (
        SELECT MONTH(created_at)
        FROM document
        WHERE YEAR(created_at) = ?
    )
    ORDER BY month;`,[year, year]);
    return res.status(200).json({
        message: 'get data ok',
        post: post

    });
    } catch (error) {
        console.error(error); // Log any errors
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
}
module.exports = {
    statisticsByTag: statisticsByTag,
    statisticsByTypes: statisticsByTypes,
    newUserStatisticsForDay: newUserStatisticsForDay,
    newPostStatisticsForDay: newPostStatisticsForDay,
    newDocumentStatisticsForDay:newDocumentStatisticsForDay,
    StatisticsForMonth: StatisticsForMonth,
    StatisticsForYear:StatisticsForYear,
    top5User: top5User,
    statisticsPostByMonth: statisticsPostByMonth,
    statisticsDocumentByMonth: statisticsDocumentByMonth
}