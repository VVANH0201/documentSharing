import pool from '../config/connectDB';
const nodemailer = require("nodemailer");
let newReport = async(req, res) =>{
    const { document_id, report_reason,user_id } = req.body;
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    try {
        await pool.execute(
            `INSERT INTO report (document_id, user_id, report_reason, report_date, status) VALUES (?, ?, ?, ?,?)`,
            [document_id, user_id, report_reason,vntime,'pending']
        );
        return res.status(200).json({
            message: 'Báo cáo vi phạm của bạn đã được gửi.',
            
        });
       
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).send('Error submitting report.');
    }
}
async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "anhanhkshb0201@gmail.com",
          pass: "oubykgczaiicexfp",
        },
    });

    let info = await transporter.sendMail({
        from: '"Document Sharing Site" <your-email@gmail.com>',
        to: to,
        subject: subject,
        text: text
    });
}
async function notifyReporter(reportId, decision) {
    try {
        const [reporter] = await pool.execute(
            `SELECT users.email FROM report
             INNER JOIN users ON report.user_id = users.id 
             WHERE report.id = ?`, [reportId]
        );

        if (reporter.length > 0) {
            const email = reporter[0].email;
            const subject = 'Your copyright report has been processed';
            const text = `Dear user,\n\nYour report with ID ${reportId} has been processed. Decision: ${decision}.\n\nThank you for helping us maintain the quality of our site.\n\nBest regards,\nDocument Sharing Site Team`;

            await sendEmail(email, subject, text);
        }
    } catch (error) {
        console.error('Error notifying reporter:', error);
    }
}
async function notifyUploader(documentId, action) {
    try {
        const [uploader] = await pool.execute(
            `SELECT users.email FROM document 
             INNER JOIN users ON document.user_id = users.id 
             WHERE document.id = ?`, [documentId]
        );

        if (uploader.length > 0) {
            const email = uploader[0].email;
            const subject = 'Action taken on your uploaded document';
            const text = `Dear user,\n\nYour document with ID ${documentId} has been subject to the following action: ${action}.\n\nIf you have any questions, please contact support.\n\nBest regards,\nDocument Sharing Site Team`;

            await sendEmail(email, subject, text);
        }
    } catch (error) {
        console.error('Error notifying uploader:', error);
    }
}

let reviewReport = async(req, res) =>{
    const currentDate = new Date();
    const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
    const Time = new Date(currentDate.getTime() + timezoneOffset);
    const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
    const reportId = req.params.id;
    const [reporter] = await pool.execute('select users.email,users.id, users.full_name FROM report INNER JOIN users ON report.user_id = users.id where report.id = ?',[reportId]);
    const [report] = await pool.execute(
        `SELECT report.id, report.document_id, document.title, report.report_reason FROM report inner join document on report.document_id = document.id WHERE report.id = ?`, [reportId]
    );
    if (reporter.length > 0) {
        const user_id = reporter[0].id;
        const email = reporter[0].email;
        const full_name = reporter[0].full_name;
        const subject = '';
        const text = `Kính gửi ${full_name},\n\nChúng tôi đã nhận được báo cáo từ bạn cho tài liệu: ${report[0].title}. Lí do: ${report[0].report_reason}.\n\nĐể có thể tiến hành xử lý, chúng tôi yêu cầu bạn cung cấp các bằng chứng minh chứng tài liệu đó là của bạn. Ví dụ như đường dẫn tới tài liệu gốc, ảnh chụp màn hình, hoặc mô tả chi tiết vi phạm,...\n\n.Gửi minh chứng về email: documentsharing@gmail.com.\n\nCảm ơn bạn đã sử dụng dịch vị của chúng tôi.\n\nBest regards,\nDocument Sharing Site Team`;

        await sendEmail(email, subject, text);
        const content = 'Báo cáo vi phạm của bạn đang được xử lý. Kiểm tra email để biết thêm chi tiết.'
        await pool.execute('INSERT INTO `notifications`(`own_id`, `content`, `created_at`,`is_active`) VALUES (?,?,?,?)',[user_id, content,vntime,1]);
    }
    
    await pool.execute(
            `UPDATE report SET status = 'reviewed' WHERE id = ?`,
            [reportId]
        );
        return res.status(200).json({
            message: 'Report reviewed successfully.',
        });
}
let resolveReport = async(req, res) =>{
    const reportId = req.params.id;

   
        await pool.execute(
            `UPDATE report SET status = 'resolved' WHERE id = ?`,
            [reportId]
        );
        const [report] = await pool.execute(
            `SELECT * FROM report WHERE id = ?`, [reportId]
        );
        const decision = report[0].report_reason;
        const documentId = report[0].document_id;
        const [user] = await pool.execute('select document.user_id from document where id =?',[documentId]);
        await notifyReporter(reportId, decision);
        // Notify the uploader
        await notifyUploader(documentId, decision);
        await pool.execute('update users set is_active = 3 where id = ?',[user[0].user_id]);
        return res.status(200).json({
            message: 'Report resolved and notifications sent successfully.',
            
        });
        
    
}
module.exports = {
    newReport: newReport,
    reviewReport: reviewReport,
    resolveReport: resolveReport
}