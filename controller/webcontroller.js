import { text } from 'body-parser';
import pool from '../config/connectDB';
var appRoot = require('app-root-path');
import PDFDocument  from "pdf-lib"
const converter = require('docx-pdf');
const fs = require('fs');
const pdf = require('pdf-parse');
const WordExtractor = require("word-extractor"); 
const fromPath = require('pdf2pic');
/**
 * GET /
 * Homepage
 */
exports.login = async(req,res) =>{
  res.render("auth/login");
}
exports.register = async(req,res) =>{
  res.render("auth/register");
    
  
}
exports.home = async(req, res) =>{
  res.render("public/index");
}
exports.forgotpass = async(req, res) =>{
  res.render("public/forgotpass")
}
const resultsPerPage = 5;
exports.account = async(req, res) =>{
  let user = res.locals.user;

  let [document] = await pool.execute("select * FROM document where user_id = ?",[user.id]);
  const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
  res.render("public/account",{user:user,document: document, post: post });
  // try {
  //   //let sql = 'SELECT * FROM posts';
  //   const [rows, fields] = await pool.execute("select * FROM document where user_id = ?",[user.id]);
  //   const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
  //   if(rows){
  //     //console.log(rows.length);
  //     const numOfResults = rows.length;
  //       const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
  //       let page = req.query.page ? Number(req.query.page) : 1;

  //       if(page > numberOfPages){
  //           res.redirect('/account?pagedocument='+encodeURIComponent(numberOfPages));
  //       }else if(page < 1){
  //           res.redirect('/account?pagedocument='+encodeURIComponent('1'));
  //       }
  //       //console.log(page);
  //       //Determine the SQL LIMIT starting number
  //       const startingLimit = (page - 1) * resultsPerPage;
  //       console.log(startingLimit);
  //       console.log(resultsPerPage);
  //       //sql = `SELECT * FROM document LIMIT ${startingLimit},${resultsPerPage} where user_id = ${user.id}`;
  //       const [rows1, fields1] = await pool.execute("select * from document where user_id = ? LIMIT ?,? ",[user.id,startingLimit, resultsPerPage]);

  //       let iterator = (page - 5) < 1 ? 1 : page - 5;
  //       console.log("iterrator: " +iterator);
  //           let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
  //           console.log("endinglink:" + endingLink);
  //           // if(endingLink < (page + 4)){
  //           //     iterator -= (page + 4) - numberOfPages;

  //           // }
  //           res.render("public/account", {data: rows1, page, iterator, endingLink, numberOfPages, post: post})
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
}
exports.AllTypes = async(req, res) =>{
  try {
    let num = 0;
    let check = false;
    const sort = req.query.sort || 'created_at';
   
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM document INNER join users on document.user_id = users.id where  document.is_active = 1 ORDER BY document.${sort} DESC`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      //console.log(rows.length);
      num = rows.length;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.pagepost) : 1;

        if(page > numberOfPages){
            res.redirect('/types/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/types/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        console.log(startingLimit);
        console.log(resultsPerPage);
        let sql = `SELECT document.id, document.user_id, document.file_type, document.title, document.link, document.view_count, document.download_count, document.data_text,document.describes, document.created_at,document.like_count, document.img, document.file_type, document.is_active, users.full_name, users.avatar_url FROM document INNER join users on document.user_id = users.id where  document.is_active = 1 ORDER BY document.${sort} DESC LIMIT ${startingLimit},${resultsPerPage} `;
        const [rows1, fields1] = await pool.execute(sql);
        // Tính toán các liên kết trang:
        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/alltype", {data: rows1, page, iterator, endingLink, numberOfPages,num: num,check:check  })
    }
    else{
      res.render("public/alltype", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.mydocument  = async (req, res) =>{
  try {
    let check = false;
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("select * FROM document where user_id = ? and is_active IN (1, 3) ORDER BY document.created_at DESC",[user.id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.pagedocument ? Number(req.query.pagedocument) : 1;

        if(page > numberOfPages){
            res.redirect('/mydocument/?pagedocument='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/mydocument/?pagedocument='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        console.log(startingLimit);
        console.log(resultsPerPage);
        let sql = `SELECT * FROM document where user_id = ${user.id} and is_active IN (1, 3) ORDER BY document.created_at DESC LIMIT ${startingLimit},${resultsPerPage} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/mydocument", {data: rows1, page, iterator, endingLink, numberOfPages, num: num,check:check  })
    }
    else{
      res.render("public/mydocument", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.search = async (req, res) =>{
  let kw = req.query.kw;
  let name1 = '%' + kw + '%';
  const [rows, fields] = await pool.execute('SELECT document.id, document.title, document.link, document.view_count, document.download_count, document.data_text, document.created_at, document.file_type, document.is_active, users.full_name, users.avatar_url FROM `document` INNER join users on document.user_id = users.id where LOWER(title) LIKE LOWER(?) and document.is_active = 1 ORDER BY document.created_at DESC  ' ,[name1]);
  res.render("public/search");
}
exports.mypost = async(req, res) => {
  try {
    let num = 0;
    let check = false;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("select * FROM posts where user_id = ? and is_active IN (1, 3)",[user.id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      //console.log(rows.length);
      num = rows.length;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.pagepost ? Number(req.query.pagepost) : 1;

        if(page > numberOfPages){
            res.redirect('/mypost/?pagepost='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/mypost/?pagepost='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        console.log(startingLimit);
        console.log(resultsPerPage);
        let sql = `SELECT * FROM posts where user_id = ${user.id} and is_active IN (1, 3) LIMIT ${startingLimit},${resultsPerPage} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/mypost", {data: rows1, page, iterator, endingLink, numberOfPages,num: num,check:check  })
    }
    else{
      res.render("public/mypost", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.documentdetail = async(req, res) => {
  let id = req.params.id;
  console.log("document_id: " + id);
  let [document] = await pool.execute("SELECT document.id,data_text,users.full_name,users.avatar_url, document.title, document.link, document.like_count, document.view_count, document.download_count, document.user_id, document.type_id, document.file_type, document.is_active, document.created_at, document.updated_at, types.name FROM `document` INNER JOIN types ON document.type_id = types.id INNER JOIN users on users.id = document.user_id WHERE document.id = ?",[id]);
  
  res.render("public/documentdetail",{ document: document[0]});
}
exports.message = async(req, res) =>{
  res.render("public/message");
}
//danh muc
exports.listtypes = async(req, res) =>{
  let id = req.params.id;
  const [type] = await pool.execute('select * from types where id = ?', [id]);
  const [rows, fields] = await pool.execute('select * from document where type_id = ?', [id]);
  res.render("public/types",{data: rows, type: type[0]});

}

exports.userdetail = async(req, res) =>{
  //let id = req.params.id;
  
  //const [post] = await pool.execute('select * from posts where user_id = ?', [id]);

  //res.render("public/user",{data: rows[0], post: post});
  try {
    let check = false;
    let id = req.params.id;
    const [user] = await pool.execute('select * from users where id = ?', [id]);
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("select * FROM posts where user_id = ? and posts.is_active = 1",[id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      //console.log(rows.length);
      check = true;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/user/'+id +'?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/user/'+id +'?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        console.log(startingLimit);
        console.log(resultsPerPage);
        let sql = `SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.created_at, posts.images, users.full_name, users.avatar_url FROM posts INNER JOIN users on users.id = posts.user_id WHERE posts.user_id = ${id} and posts.is_active = 1 LIMIT ${startingLimit},${resultsPerPage} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/user", {data: user[0],data1: rows1, page, iterator, endingLink, numberOfPages,iduser:id, check: check  })
    }
    else{
      res.render("public/user", {data: user[0],check: check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.following = async(req, res) =>{
  //let user = req.locals.user;
  try {
    let resultsPerPages = 10;
    let num = 0;
    let check = false;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("SELECT follows.followed_user_id, users.full_name, users.avatar_url FROM `follows` INNER JOIN users on users.id = follows.followed_user_id WHERE following_user_id = ? ",[user.id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      //console.log(rows.length);
      num = rows.length;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.pagepost ? Number(req.query.pagepost) : 1;

        if(page > numberOfPages){
            res.redirect('/friend/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/friend/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT follows.followed_user_id, users.full_name, users.avatar_url FROM follows INNER JOIN users on users.id = follows.followed_user_id WHERE following_user_id = ${user.id} LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/friend", {data: rows1, page, iterator, endingLink, numberOfPages,num: num,check:check  })
    }
    else{
      res.render("public/friend", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
  //res.render("public/friend");
}
exports.listnoti = async(req, res) => {
  let resultsPerPages = 10;
  try {
    let check = false;
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute('SELECT notifications.id, notifications.own_id, notifications.user_id, notifications.content, notifications.created_at, notifications.link, users.full_name, users.avatar_url FROM `notifications` INNER JOIN users on notifications.user_id = users.id WHERE notifications.own_id = ? ORDER BY notifications.created_at DESC ',[user.id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/noti/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/noti/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT notifications.id, notifications.own_id, notifications.user_id, notifications.content, notifications.created_at, notifications.link, users.full_name, users.avatar_url, notifications.is_active FROM notifications INNER JOIN users on notifications.user_id = users.id WHERE notifications.own_id = ${user.id} ORDER BY notifications.created_at DESC LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/listnoti", {data: rows1, page, iterator, endingLink, numberOfPages, num: num, check: check  })
    }
    else{
      res.render("public/listnoti", { check: check  })
    }
  } catch (error) {
    console.log(error);
  }

  //res.render("public/listnoti");
}
//
exports.tags = async(req, res) =>{
  try {
    let check = false;
    let id = req.params.id;
    const [tag] = await pool.execute('select * from tags where id = ?', [id]);
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("select * FROM tags_post where tag_id = ?",[id]);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      //console.log(rows.length);
      check = true;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/tag/'+id +'?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/tag/'+id +'?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        console.log(startingLimit);
        console.log(resultsPerPage);
        let sql = `SELECT posts.id, posts.title, posts.body, posts.like_count, posts.created_at, tags.id as tagid, tags.name_tag, users.full_name, users.avatar_url FROM posts INNER JOIN tags_post on tags_post.post_id = posts.id
        INNER JOIN tags on tags.id = tags_post.tag_id
        INNER JOIN users on users.id = posts.user_id
        WHERE tags_post.tag_id = ${id} and posts.is_active = 1 LIMIT ${startingLimit},${resultsPerPage} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("public/tag", {data: rows1, page, iterator, endingLink, numberOfPages, tagid:id,tag:tag[0], check: check})
    }
    else{
      res.render("public/tag", {tag:tag[0],check: check});
    
    }
   
  } catch (error) {
    console.log(error);
  }

}
exports.postdetail = async(req, res) =>{
  let id = req.params.id;
  const [rows, fields] = await pool.execute('SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count,posts.view_count, posts.created_at, posts.images, posts.is_active, users.full_name, users.avatar_url FROM posts INNER JOIN users on users.id = posts.user_id where posts.id = ? and posts.is_active = 1', [id]);
  if(rows.length){
    res.render("public/postdetail", {post: rows[0]});
  }
  else{
    res.render("public/error");
  }
  
}
exports.upload = async(req,res) =>{
  let user = res.locals.user;
  let sql = 'SELECT * FROM types';
  const [rows, fields] = await pool.execute(sql);
  res.render("public/upload", {user: user, types: rows, alert: ''});
}
exports.uploadpost = async(req, res) =>{
  let sql = 'SELECT * FROM tags';
  const [rows, fields] = await pool.execute(sql);
  res.render("public/uploadpost",{tag: rows});
}
exports.uploadPost = async( req, res) =>{
  console.log(req.body.user_id);
  console.log(req.body.title);
  console.log(req.body.tag);
  console.log(req.file);
  console.log(req.body.content);
  const user_id = req.body.user_id;
  const title = req.body.title;
  const content = req.body.content;
  const tag = req.body.tag;
  const currentDate = new Date();
  const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
  const Time = new Date(currentDate.getTime() + timezoneOffset);
  const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
  const [new_post] = await pool.execute('INSERT INTO `posts`(`title`, `body`, `user_id`, `like_count`, `is_active`, `created_at`,`images`,`view_count`) VALUES (?,?,?,?,?,?,?,?)',[title,content,user_id,0,1,vntime,req.file.filename,0]);
  const new_post_id = new_post.insertId;
  const [user_follow] = await pool.execute('select follows.followed_user_id from follows where following_user_id = ?', [user_id]);

  if(user_follow.length){
    console.log(user_follow.length);
    console.log(user_follow);
    const [user_name] = await pool.execute('select full_name from users where id = ?', [user_id]);
    let content_noti =user_name[0].full_name +' đã đăng bài viết mới';
    let link_noti = '/post/'+new_post_id;
    user_follow.forEach( async element => {
      console.log(element);
    });
    user_follow.forEach( async element => {
      const followedUserId = element.followed_user_id;
      await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[Number(followedUserId),user_id, content_noti,vntime,link_noti,1]);
    });
  }
  const [rows, fields] = await pool.execute('SELECT * FROM `posts` ORDER BY created_at DESC');
  let id = rows[0].id;
  tag.forEach( async element => {
    await pool.execute('insert into tags_post (`tag_id`, `post_id`) values(?,?)',[element,id]);
  });


  
  return res.redirect('/account');
}
exports.updatepost = async(req, res) =>{
  console.log(req.body.user_id);
  console.log(req.body.post_id);
  console.log(req.body.title);
  console.log(req.body.tag);
  console.log(req.file);
  console.log(req.body.content);
  const user_id = req.body.user_id;
  const title = req.body.title;
  const content = req.body.content;
  const tag = req.body.tag;
  const post_id = req.body.post_id;
  const currentDate = new Date();
  const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
  const Time = new Date(currentDate.getTime() + timezoneOffset);
  const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');

  const [post] = await pool.execute('select * from posts where id = ?',[post_id]);
  const path = post[0].images;
  const filepath = appRoot + "/public/img/"+ path;


  
  await pool.execute('update posts set title = ?, body = ?, user_id = ?,created_at = ?, updated_at = ?, images = ? where posts.id = ?',[title, content, user_id,vntime ,vntime,req.file.filename,post_id ]);

  const [tags] = await pool.execute('select * from tags_post where post_id = ?',[post_id]);
  //const length = tags.length;
  if(tags.length){
    tags.forEach( async element => {
      await pool.execute('delete from tags_post where post_id = ?',[post_id]);
    });
  }
  const [rows, fields] = await pool.execute('SELECT * FROM `posts` ORDER BY created_at DESC');
  let id = rows[0].id;
  tag.forEach( async element => {
    await pool.execute('insert into tags_post (`tag_id`, `post_id`) values(?,?)',[element,id]);
  });
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File deleted successfully!');
  });
   return res.redirect('/account');

}
exports.changefile = async(req, res) =>{
  console.log(req.file);
  // let { id } = req.body;
  // let file = req.file;
  // console.log("id: " + id);
  // console.log("file: " + file);
}
exports.viewpost = async(req, res) =>{
  const id = req.params.id;
  let sql = 'SELECT * FROM tags';
  const [rows, fields] = await pool.execute(sql);
  const [post] = await pool.execute('select * from posts where id = ?',[id]);
  res.render("public/viewpost",{post:post[0],tag: rows});
}
exports.adminhomepage = async(req, res) => {
  res.render("admin/index");
}
exports.admincustomer = async(req, res) => {
  res.render("admin/customer");

}
exports.adminlogin = async(req, res) =>{
  res.render("admin/login");
}
exports.adminuser = async(req, res) =>{
  try {
    let resultsPerPages = 7;
    let num = 0;
    let user = res.locals.user;
    
    const [rows, fields] = await pool.execute("select * FROM users where role = 1 and is_active IN (1, 3) ");
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows){
      //console.log(rows.length);
      num = rows.length;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.pageuser ? Number(req.query.pageuser) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/user/?pageuser='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/user/?pageuser='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT 
                    u.id AS id,
                    u.full_name AS full_name,
                    u.email AS email,
                    u.phone_number AS phone_number,
                    u.is_active AS is_active,
                    u.role AS role,
                    u.created_at AS created_at,
                    u.avatar_url AS avatar_url,
                    COALESCE(d.document_count, 0) AS document_count,
                    COALESCE(p.post_count, 0) AS post_count
                FROM 
                    users u
                LEFT JOIN 
                    (
                        SELECT 
                            user_id, 
                            COUNT(id) AS document_count
                        FROM 
                            document WHERE document.is_active = 1
                        GROUP BY 
                            user_id
                    ) d ON u.id = d.user_id
                LEFT JOIN 
                    (
                        SELECT 
                            user_id, 
                            COUNT(id) AS post_count
                        FROM 
                            posts WHERE posts.is_active =1
                        GROUP BY 
                            user_id
                    ) p ON u.id = p.user_id
                    where u.is_active IN (1, 3) and u.role = 1 LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);
        
        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/useradmin", {data: rows1, page, iterator, endingLink, numberOfPages,num:num  })
    }
  } catch (error) {
    console.log(error);
  }
  // res.render("admin/useradmin");
}
exports.adminpost = async(req, res) =>{
  try {
    let resultsPerPages = 7;
    let num =0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute("select posts.id, posts.user_id, posts.is_active, posts.title, posts.body, users.full_name FROM posts INNER join users on users.id = posts.user_id where posts.is_active = 1 ");
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows){
      //console.log(rows.length);
      num = rows.length;
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.pagepost ? Number(req.query.pagepost) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/post/?pagepost='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/post/?pagepost='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT posts.id, posts.user_id, posts.is_active, posts.title, posts.body, users.full_name FROM posts inner join users on users.id = posts.user_id where posts.is_active = 1  LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/postadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num: num  })
    }
  } catch (error) {
    console.log(error);
  }
  
}
exports.admindocument = async(req, res) =>{
  let resultsPerPages = 7;
  try {
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT document.id, document.user_id, document.type_id, document.title, document.like_count, document.view_count, document.file_type, document.created_at, users.full_name, types.name FROM document
    INNER JOIN types on types.id = document.type_id
    INNER JOIN users on users.id = document.user_id where document.is_active = 1 `);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows){
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/document/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/document/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT document.id, document.user_id,document.download_count, document.type_id, document.title, document.like_count, document.view_count, document.file_type, document.created_at, users.full_name, types.name FROM document 
        INNER JOIN types on types.id = document.type_id
        INNER JOIN users on users.id = document.user_id where document.is_active = 1 LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/documentadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num: num  })
    }
  } catch (error) {
    console.log(error);
  }
  //res.render("admin/documentadmin");
}
exports.admincomment = async(req, res) =>{
  let resultsPerPages = 7;
  try {
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT comments.id, comments.user_id, comments.post_id, comments.document_id, comments.parent_comment_id, comments.content, comments.like_count, comments.created_at, comments.is_active, users.full_name FROM comments INNER JOIN users on users.id = comments.user_id where comments.is_active =1`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows){
      //console.log(rows.length);
      const numOfResults = rows.length;
      num = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/comment/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/comment/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT comments.id, comments.user_id, comments.post_id, comments.document_id, comments.parent_comment_id, comments.content, comments.like_count, comments.created_at, comments.is_active, users.full_name FROM comments INNER JOIN users on users.id = comments.user_id where comments.is_active = 1 ORDER BY comments.created_at DESC LIMIT ${startingLimit},${resultsPerPages}  `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/commentadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num: num  })
    }
  } catch (error) {
    console.log(error);
  }
  //res.render("admin/commentadmin");
}
exports.adminType = async(req, res) =>{
  let resultsPerPages = 7;
  try {
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`select * from types`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/types/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/types/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `select * from types LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/typeadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num: num  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.admintag = async(req, res) =>{
  let resultsPerPages = 10;
  try {
    let num = 0;
    let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`select * from tags`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/tags/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/tags/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `select * from tags LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/tagadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num: num  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.adminfeedback = async(req, res) =>{
  let resultsPerPages = 10;
  try {
    let check = false;
    let num = 0;
    //let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT feedback.id, feedback.user_id, feedback.content, feedback.created_at, users.full_name FROM feedback INNER JOIN users on feedback.user_id = users.id`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/feedback/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/feedback/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT feedback.id, feedback.user_id, feedback.content, feedback.created_at, users.full_name FROM feedback INNER JOIN users on feedback.user_id = users.id LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/feedbackadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num:num ,check:check  })
    }
    else{
      res.render("admin/feedbackadmin", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.adminreport = async(req, res) =>{
  let resultsPerPages = 10;
  try {
    let check = false;
    let num = 0;
    //let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'pending'`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/report/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/report/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'pending' LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/reportadmin", {data: rows1, page, iterator, endingLink, numberOfPages, num:num ,check:check  })
    }
    else{
      res.render("admin/reportadmin", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.adminresolvereport = async(req, res) =>{
  let resultsPerPages = 10;
  try {
    let check = false;
    let num = 0;
    //let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'resolved'`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/reportresolve/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/reportresolve/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'resolved' LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/resolvereport", {data: rows1, page, iterator, endingLink, numberOfPages, num:num ,check:check  })
    }
    else{
      res.render("admin/resolvereport", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.adminrewiewreport = async(req, res) =>{
  let resultsPerPages = 10;
  try {
    let check = false;
    let num = 0;
    //let user = res.locals.user;
    //let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(`SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'reviewed'`);
    //const [post] = await pool.execute('select * from posts where user_id = ?', [user.id]);
    if(rows.length){
      check = true;
      num = rows.length;
      //console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPages);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/admin/reportreview/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/admin/reportreview/?page='+encodeURIComponent('1'));
        }
        //console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPages;
        console.log(startingLimit);
        console.log(resultsPerPages);
        let sql = `SELECT report.id, users.full_name, document.title, report.report_reason, report.report_date,report.status FROM report INNER JOIN users on users.id = report.user_id INNER JOIN document on document.id = report.document_id WHERE report.status = 'reviewed' LIMIT ${startingLimit},${resultsPerPages} `;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render("admin/reviewreport", {data: rows1, page, iterator, endingLink, numberOfPages, num:num ,check:check  })
    }
    else{
      res.render("admin/reviewreport", {check:check  })
    }
  } catch (error) {
    console.log(error);
  }
}
exports.homepage = async (req, res) => {
  //const s = req.body.id_user;
  //console.log(s);
  //console.log("user_id: "+ res.locals.user.id);
  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  
  try {
    let sql = 'SELECT * FROM posts';
    const [rows, fields] = await pool.execute(sql);
    if(rows){
      console.log(rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;

        if(page > numberOfPages){
            res.redirect('/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/?page='+encodeURIComponent('1'));
        }
        console.log(page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * FROM posts LIMIT ${startingLimit},${resultsPerPage}`;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render('index', {data: rows1, page, iterator, endingLink, numberOfPages, locals})
    }
    // pool.query(sql, (err, result) => {
    //     if(err) throw err;
    //     const numOfResults = result.length;
    //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    //     let page = req.query.page ? Number(req.query.page) : 1;
    //     if(page > numberOfPages){
    //         res.redirect('/?page='+encodeURIComponent(numberOfPages));
    //     }else if(page < 1){
    //         res.redirect('/?page='+encodeURIComponent('1'));
    //     }
    //     //Determine the SQL LIMIT starting number
    //     const startingLimit = (page - 1) * resultsPerPage;
    //     //Get the relevant number of POSTS for this starting page
    //     sql = `SELECT * FROM users LIMIT ${startingLimit},${resultsPerPage}`;
    //     pool.query(sql, (err, result)=>{
    //         if(err) throw err;
    //         let iterator = (page - 5) < 1 ? 1 : page - 5;
    //         let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
    //         if(endingLink < (page + 4)){
    //             iterator -= (page + 4) - numberOfPages;
    //         }
    //         res.render('index', {data: result, page, iterator, endingLink, numberOfPages, locals});
    //     });
    // });
  } catch (error) {
    console.log(error);
  }
};
exports.getadminaddpost = async(req, res) =>{
  let sql = 'SELECT * FROM tags';
  const [rows, fields] = await pool.execute(sql);
  //res.render("public/uploadpost",{tag: rows});
  res.render("admin/addpost",{tag:rows});
}
exports.adminaddposst = async(req, res) =>{
  console.log(req.body.user_id);
  console.log(req.body.title);
  console.log(req.body.tag);
  console.log(req.file);
  console.log(req.body.content);
  const user_id = req.body.user_id;
  const title = req.body.title;
  const content = req.body.content;
  const tag = req.body.tag;
  const currentDate = new Date();
  const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
  const Time = new Date(currentDate.getTime() + timezoneOffset);
  const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
  await pool.execute('INSERT INTO `posts`(`title`, `body`, `user_id`, `like_count`, `is_active`, `created_at`,`images`) VALUES (?,?,?,?,?,?,?)',[title,content,user_id,0,1,vntime,req.file.filename]);
  
  const [rows, fields] = await pool.execute('SELECT * FROM `posts` ORDER BY created_at DESC');
  let id = rows[0].id;
  tag.forEach( async element => {
    await pool.execute('insert into tags_post (`tag_id`, `post_id`) values(?,?)',[element,id]);
  });

  
  return res.redirect('/admin/post');
}
exports.adminviewpost = async(req, res) =>{
  let id = req.params.id;
  const [rows, fields] = await pool.execute('SELECT posts.id, posts.user_id, posts.title, posts.body, posts.like_count, posts.created_at, posts.images, posts.is_active, users.full_name, users.avatar_url FROM posts INNER JOIN users on users.id = posts.user_id where posts.id = ?', [id]);
  //res.render("public/postdetail", {post: rows[0]});
  res.render("admin/adminviewpost",{post:rows[0]});
}
exports.adminviewdocument = async(req, res) =>{
  let id = req.params.id;
  console.log("document_id: " + id);
  let [document] = await pool.execute("SELECT document.id,data_text,users.full_name,users.avatar_url, document.title, document.link, document.like_count, document.view_count, document.download_count, document.user_id, document.type_id, document.file_type, document.is_active, document.created_at, document.updated_at, types.name FROM `document` INNER JOIN types ON document.type_id = types.id INNER JOIN users on users.id = document.user_id WHERE document.id = ?",[id]);
  
  res.render("admin/adminviewdocument",{ document: document[0]});
}
exports.adminviewuser = async(req, res) =>{
  let id = req.params.id;
  let [user] = await pool.execute('select * from users where id = ?',[id]);
  res.render("admin/adminviewuser",{ user: user[0]});
}
// exports.homepage = async (req, res) => {
//     const messages = await req.consumeFlash('info');
//     const locals = {
//       title: 'NodeJs',
//       description: 'Free NodeJs User Management System'
//     }

//     try {
//       const customers = await Customer.find({}).limit(22);
//       res.render('index', { locals, messages, customers } );
//     } catch (error) {
//       console.log(error);
//     }
// }

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {


  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };
  try {
    let sql = 'SELECT * FROM users';
    const [rows, fields] = await pool.execute(sql);
    if(rows){
      console.log("about: "+rows.length);
      const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.pageuser ? Number(req.query.pageuser) : 1;

        if(page > numberOfPages){
            res.redirect('/about/?pageuser='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/about/?pageuser='+encodeURIComponent('1'));
        }
        console.log("about: " +page);
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * FROM users LIMIT ${startingLimit},${resultsPerPage}`;
        const [rows1, fields1] = await pool.execute(sql);

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterrator about: " +iterator);
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            console.log("endinglink about:" + endingLink);
            // if(endingLink < (page + 4)){
            //     iterator -= (page + 4) - numberOfPages;

            // }
            res.render('about', {data: rows1, page, iterator, endingLink, numberOfPages, locals})
    }
    // pool.query(sql, (err, result) => {
    //     if(err) throw err;
    //     const numOfResults = result.length;
    //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    //     let page = req.query.page ? Number(req.query.page) : 1;
    //     if(page > numberOfPages){
    //         res.redirect('/?page='+encodeURIComponent(numberOfPages));
    //     }else if(page < 1){
    //         res.redirect('/?page='+encodeURIComponent('1'));
    //     }
    //     //Determine the SQL LIMIT starting number
    //     const startingLimit = (page - 1) * resultsPerPage;
    //     //Get the relevant number of POSTS for this starting page
    //     sql = `SELECT * FROM users LIMIT ${startingLimit},${resultsPerPage}`;
    //     pool.query(sql, (err, result)=>{
    //         if(err) throw err;
    //         let iterator = (page - 5) < 1 ? 1 : page - 5;
    //         let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
    //         if(endingLink < (page + 4)){
    //             iterator -= (page + 4) - numberOfPages;
    //         }
    //         res.render('index', {data: result, page, iterator, endingLink, numberOfPages, locals});
    //     });
    // });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Post - NodeJs",
    description: "Free NodeJs User Management System",
  };

  res.render("customer/add", locals);
};

/**
 * POST /
 * Create New Customer
 */
exports.postCustomer = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  try {
    let id = req.body.user_id;
    let img = req.file.filename;
    await pool.execute('update users set avatar_url= ? where id = ?',
    [img, id]);
    //let { title, content } = req.body;
    //let file = req.file;
    //console.log(file);
    // let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // await pool.execute('insert into post(title, content, time_create, post_img) values (?, ?, ?, ?)',
    //     [title, content, time, file]);
    let [user] = await pool.execute("select * FROM users where id = ?",[id]);
    req.session.user = user[0];
    return res.redirect('/account')
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {
  try {

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };
    // const userid = req.params.id;
    // let [post] = await pool.execute('SELECT users.id, users.full_name, users.email,userinfo.favorites, '+
    // 'userinfo.study_at, userinfo.other_info, userinfo.date_of_birth FROM `users` INNER JOIN userinfo where users.id = ?', [userid]);
   
      res.render("customer/view", {
        
      });
    
    
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Edit Customer Data
 */
exports.edit = async (req, res) => {
  try {

    const locals = {
      title: "Edit Customer Data",
      description: "Free NodeJs User Management System",
    };
    const postId = req.params.id;
    let [post] = await pool.execute('Select * from posts where id = ?', [postId]);
   
    res.render("customer/edit", {
      locals, datapost:post[0]
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Update Customer Data
 */
exports.updateUsers = async(req, res) => {
  console.log(req.body);
  console.log(req.session.user.id);
  try {
    let full_name = req.body.fullname;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let username = req.body.username;
    let id = req.session.user.id;
    await pool.execute('update users set full_name = ?, username = ?, address = ?, phone_number = ?  where id = ?',[full_name, username,address,phone_number, id]);
    let [user] = await pool.execute("select * FROM users where id = ?",[id]);
    req.session.user = user[0];
    return res.redirect('/account')
  } catch (error) {
    console.log(error);
  }
}


const pdfPoppler = require('pdf-poppler');
exports.uploaddocument = async(req, res) => {
  
  // if(req.file.filename !== null){
  //   let extensions  = req.file.filename.split(".");
  //   console.log(extensions[1]);

  // }
  console.log(req.body.user_id);
  //console.log(req.body.tentailieu);
  let title = req.body.tentailieu;
  let user_id = req.body.user_id;
  let describes = req.body.describes;
    let types = req.body.types;
  console.log(title);
  const img = 'document.jpg';
  const currentDate = new Date();
  const timezoneOffset = 7 * 60 * 60 * 1000; // Convert hours to milliseconds
  const Time = new Date(currentDate.getTime() + timezoneOffset);
  const vntime = Time.toISOString().slice(0, 19).replace('T', ' ');
  try{
   
    if(req.file){
      const file_name = req.file.filename;
      const filename = req.file.originalname;
      const filepath = req.file.path;
      
      
    // Kiểm tra định dạng file
      const extension = filename.split('.').pop();
      console.log(extension);
      if (extension === 'doc' || extension === 'docx') {
        const extractor = new WordExtractor();
        const extracted = extractor.extract(filepath);
        let text;
        
        extracted.then(function(doc) {
          text = doc.getBody();
          console.log("body: " +text); 
        });
        console.log(extension);
        console.log(req.file.path);
        console.log(appRoot);
        
        const pdfpath = appRoot + "/public/img/" +  Date.now() +"output.pdf";
        try {
          converter (filepath, pdfpath, async function (err, result) {
            if (err) {
              console.log("Converting Doc to PDF  failed", err);
            }
            
            console.log(result);
            const filepdfname = result.filename.split('\\').pop();
            console.log(filepdfname);
            fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('File deleted successfully!');
      });
            const [results] = await pool.execute('INSERT INTO `document`(`user_id`, `type_id`, `title`, `link`,`is_active`, `created_at`, `updated_at`,`data_text`,file_type, view_count,download_count,img,describes ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
            ,[user_id,types,title,filepdfname, 1,vntime,vntime, text,extension, 0,0,img,describes ]);
            const documentId = results.insertId;
           
            const [user_follow] = await pool.execute('select follows.followed_user_id from follows where following_user_id = ?', [user_id]);
            if(user_follow.length){
              console.log(user_follow.length);
              console.log(user_follow);
              const [user_name] = await pool.execute('select full_name from users where id = ?', [user_id]);
              let content_noti =user_name[0].full_name +' đã đăng tài liệu mới';
              let link_noti = '/document/view/'+documentId;
              user_follow.forEach( async element => {
                console.log(element);
              });
              user_follow.forEach( async element => {
                const followedUserId = element.followed_user_id;
                await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[Number(followedUserId),user_id, content_noti,vntime,link_noti,1]);
              });
            }
            

          //   await pool.execute(
          //     `INSERT INTO document_copyright (document_id, user_id, copyright_info) VALUES (?, ?, ?)`,
          //     [documentId, user_id, copyright_info]
          // );
            return res.redirect('/mydocument'); 
            //file_name = filepdfname;
          });
          
        } catch (err) {
          console.error('Error converting file:', err);
          //res.status(500).json({ message: 'Error converting file' });
        }
        
      }
      else{
        let textpdf="";
        let extension1 = 'pdf';
        let img1 = "";

        
        
        let dataBuffer = fs.readFileSync(filepath);

        pdf(dataBuffer).then (async function(data) {
            textpdf = data.text;
            const [results] = await pool.execute('INSERT INTO `document`(`user_id`, `type_id`, `title`, `link`,`is_active`, `created_at`, `updated_at`, `data_text`,`file_type`, `view_count`, `download_count`,`img`,`describes`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
            ,[user_id,types,title,req.file.filename, 1,vntime,vntime,data.text,extension1,0,0,img,describes  ]);
            const documentId = results.insertId;
           
            const [user_follow] = await pool.execute('select follows.followed_user_id from follows where following_user_id = ?', [user_id]);
            if(user_follow.length){
              console.log(user_follow.length);
              console.log(user_follow);
              const [user_name] = await pool.execute('select full_name from users where id = ?', [user_id]);
              let content_noti =user_name[0].full_name +' đã đăng tài liệu mới';
              let link_noti = '/document/view/'+documentId;
              user_follow.forEach( async element => {
                console.log(element);
              });
              user_follow.forEach( async element => {
                const followedUserId = element.followed_user_id;
                await pool.execute('INSERT INTO `notifications`(`own_id`, `user_id`, `content`, `created_at`, `link`,`is_active`) VALUES (?,?,?,?,?,?)',[Number(followedUserId),user_id, content_noti,vntime,link_noti,1]);
              });
            }
          //   const documentId = results.insertId;
          //   await pool.execute(
          //     `INSERT INTO document_copyright (document_id, user_id, copyright_info) VALUES (?, ?, ?)`,
          //     [documentId, user_id, copyright_info]
          // );
            //console.log(3);
            return res.redirect('/mydocument');
      });
      //console.log(textpdf);
      //console.log(2);
        
      }

      
      
    }
    

    //console.log(tentailieu);
    
  }
  catch(er){
    
  }
}
exports.editPost = async (req, res) => {
  try {
    // let { title, content,id } = req.body;
    // let file = req.file.filename;
    // let time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // console.log(req.body);
    // await pool.execute('update users set title= ?, content = ? , post_img = ?, time_create = ?  where id = ?',
    //     [title, content, file,time, id]);
    //await res.redirect(`/edit/${req.params.id}`);
    return res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {
  try {
    let postID = req.body.iddel;
    await pool.execute('delete from posts where id = ?', [postID])
    return res.redirect('/');
    
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search Customer Data
 */
exports.searchCustomers = async (req, res) => {
  const locals = {
    title: "Search Customer Data",
    description: "Free NodeJs User Management System",
  };

  try {

    res.render("search", {
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};