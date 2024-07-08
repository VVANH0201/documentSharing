const content_post = document.getElementById("content_post");
const id = document.getElementById("post_id").value;

function load(){
   $.ajax({
   type: "GET",
   url: `http://localhost:8001/api/v1/post/`+id ,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       id: id
   }),
   success: function (response) {
      
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
      console.log(response.message);
      console.log(response.data);
      content_post.innerHTML = response.data.body;
      
   },
   error: function (error) {
       console.log(error);
      
   },
});
}
load();
function getcomment(){
   const post_id = document.getElementById(`post_id`).value;
   //const document_id = id;
   $.ajax({
       url: `http://localhost:8001/api/v1/comment/post/${post_id}`, // Replace with your actual API endpoint URL
       type: 'GET',
       dataType: 'json',
       success: function(response) {
       if (response.message === 'ok') {
           const comments = response.data;
           let count = response.num;
           console.log(response.data);
           console.log(response.message);
           $('#num').empty();
           $('#num').append(`Bình luận (` + count + `)`);
           // Handle successful response and display comments (replace with your desired logic)
           $('#list_comment').empty(); // Clear existing comments (optional)
           for (const comment of comments) {
               const commentHtml = `
               <li>
                   <div class="avatar avatar-online" style="display: inline-block; ">
                       <img style="border-radius: 100%;" src="/img/${comment.avatar_url}" alt=""> 
                   </div>
                   <div class="we-comment">
                       <div class="d-flex justify-content-between">
                           <h4><a href="/user/${comment.user_id}" title="">${comment.full_name} </a></h4>
                                     
                           <div class="btn-group">
                               <button class="btn  btn-xs btn-icon rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                               <i class="bx bx-dots-vertical-rounded"></i>
                               </button>
                               <ul class="dropdown-menu">
                                   <li><a class="dropdown-item" onclick = "updateComment(${comment.id})">Sửa</a></li>
                                   <li><a class="dropdown-item" onclick = "deleteComment(${comment.id})">Xóa</a></li>
                                   
                               </ul>
                           </div>
                       </div>
                                   
                       <h5 id = "currentcontentComment${comment.id}"> ${comment.content}
                           
                       </h5>
                       <div id="editComment${comment.id}" style="display: none;">
                       <textarea class="comment_textarea_reply" id="editedContentComment${comment.id}"></textarea>
                       <button class=" btn" id="saveButton" onclick="saveEditComment(${comment.id},${comment.post_id})" >Lưu</button>
                       </div>
                       <div class="inline-itms">
                           <span>${countTime(comment.created_at)}</span>
                           <a class="we-reply" onclick="showReplyForm(${comment.id})" title="Reply"><i class='bx bx-reply'></i></i></a>
                           <a onclick = "likecomment(${comment.id}, ${comment.user_id})" title=""><i class='bx bx-heart' ></i></i><span>${comment.like_count} </span></a>
                           <ul id="nestedComments${comment.id}" class="nested-comments" style="display: none;">

                           </ul>
                           <div id="replyForm${comment.id}" class = "mt-2" style="display: none;">
                               <textarea id="newReplyContent${comment.id}" class="comment_textarea_reply" placeholder=""></textarea>
                               <button class="post-btn btn" onclick="addNewReply(${comment.id},${comment.post_id},${comment.id},${comment.user_id})">Trả lời</button>
                           </div>
                       </div>
                   </div>
               </li>
               `;
       $('#list_comment').append(commentHtml);
      
     }
   } else {
     alert('An error occurred: ' + response.message); // Handle potential errors
   }
 },
 error: function(jqXHR, textStatus, errorThrown) {
   console.error('Error:', textStatus, errorThrown);
   alert('There was a problem fetching comments. Please try again later.'); // User-friendly error message
 }
});
}
function showReplyForm(comment_id) {
const nestedComments = document.getElementById(`nestedComments${comment_id}`);

if (nestedComments.style.display === 'none' || nestedComments.style.display === '') {
   nestedComments.style.display = 'block';
} else {
   nestedComments.style.display = 'none';
}

$.ajax({
   type: "GET",
   url: `http://localhost:8001/api/v1/comment/${comment_id}`,
   headers: {
       // 'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBWZXIiOiIwLjAuMCIsImV4cCI6NDcyNjM4OTEyMiwibG9jYWxlIjoiIiwibWFzdGVyVmVyIjoiIiwicGxhdGZvcm0iOiIiLCJwbGF0Zm9ybVZlciI6IiIsInVzZXJJZCI6IiJ9.QIZbmB5_9Xlap_gDhjETfMI6EAmR15yBtIQkWFWJkrg',
   },
   success: function (response) {

       if (response.data == null) {
           console.log("no");
       } else {
           //numComment = response.data.length;
           let $str = response.data.map(function (comment) {
               return `
               <li>
                   <div class="avatar avatar-online" style="display: inline-block; ">
                       <img style="border-radius: 100%;" src="/img/${comment.avatar_url}" alt=""> 
                   </div>
                   <div class="we-comment">
                       <div class="d-flex justify-content-between">
                           <h4><a href="/user/${comment.user_id}" title="">${comment.full_name} </a></h4>
                                       
                           <div class="btn-group">
                               <button class="btn  btn-xs btn-icon rounded-pill dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                               <i class="bx bx-dots-vertical-rounded"></i>
                               </button>
                               <ul class="dropdown-menu">
                                   <li><a class="dropdown-item" onclick = "updateComment(${comment.id})">Sửa</a></li>
                                   <li><a class="dropdown-item" onclick = "deleteComment(${comment.id})">Xóa</a></li>
                                   
                               </ul>
                           </div>
                       </div>
                                   
                       <h5 id = "currentcontentComment${comment.id}"> ${comment.content}
                           
                       </h5>
                       <div id="editComment${comment.id}" style="display: none;">
                       <textarea class="comment_textarea_reply" id="editedContentComment${comment.id}"></textarea>
                       <button class=" btn" id="saveButton" onclick="saveEditComment(${comment.id})" >Lưu</button>
                       </div>
                       <div class="inline-itms">
                           <span>${countTime(comment.created_at)}</span>
                           <a class="we-reply" onclick="showReplyForm(${comment.id})" title="Reply"><i class='bx bx-reply'></i></i></a>
                           <a onclick = "likecomment(${comment.id}, ${comment.user_id})" title=""><i class='bx bx-heart' ></i></i><span>${comment.like_count} </span></a>
                           <ul id="nestedComments${comment.id}" class="nested-comments" style="display: none;">

                           </ul>
                           <div id="replyForm${comment.id}" class = "mt-2" style="display: none;">
                               <textarea id="newReplyContent${comment.id}" class="comment_textarea_reply" placeholder=""></textarea>
                               <button class="post-btn btn comment_submit" onclick="addNewReply(${comment.id},${comment.post_id},${comment.id}, ${comment.user_id})">Trả lời</button>
                           </div>
                       </div>
                   </div>
               </li>
           
           `;
           });
           //var str1 = "" + numComment;
           $("#nestedComments" + "" + comment_id).html($str);
           //$("#numCm" + id_post).html(str1);
       }
   },
});

const replyForm = document.getElementById(`replyForm${comment_id}`);

if (replyForm.style.display === 'none' || replyForm.style.display === '') {
   replyForm.style.display = 'block';
} else {
   replyForm.style.display = 'none';
}
}
getcomment();
function likecomment(comment_id,own_id){
const user_id = document.getElementById(`user_id`).value; 
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/like/comment` ,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       user_id: user_id,
       comment_id: comment_id,
       own_id: own_id
   }),
   success: function (response) {
      
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
      console.log(response.message);
      getcomment();
   },
   error: function (error) {
       console.log(error);
       getcomment();
   },
});
}
function newcomment(user_id, post_id, own_id){
var content = document.getElementById("myInput").value;
console.log(content);
var requests = {
   "url": `http://localhost:8001/api/v1/comment/post`,
   "method": "POST",
   "headers": {
       "Content-Type": "application/json"
   },
   "data": JSON.stringify({
       "user_id": user_id,
       "post_id": post_id,
       "content": content,
       "own_id": own_id
   })
}
$.ajax(requests).done(function (response) {
   console.log(response.message);
   getcomment();
})
   .fail(function (errorThrown) {
       console.error("Lỗi: ", errorThrown);
      getcomment();
   });
}
function updateComment(comment_id){
const user_id = document.getElementById(`user_id`).value; 
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/comment/checkuser`,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       user_id: user_id,
       comment_id: comment_id
       
   }),
   success: function (data) {
       console.log(data);
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
       if(data.status == 1){
           document.getElementById('editComment' + comment_id).style.display = 'block';
           const currentContent = document.getElementById('currentcontentComment' + comment_id).innerText;
           document.getElementById('editedContentComment' + comment_id).value = currentContent;
           document.getElementById('editedContentComment' + comment_id).focus();
           const text = document.getElementById('currentcontentComment'+comment_id);
           text.style.display = 'none';
       }
       else{
           $.toast({
       heading: 'Bạn không được sửa bình luận của người khác',
       text: 'Bạn không được sửa bình luận của người khác',
       showHideTransition: 'fade',
       icon: 'error',
       hideAfter: 3000,
       loaderBg: '#fa6342',
       position: 'bottom-right',
   });
       }
   },
   error: function (error) {
       console.log(error);
   },

});



}
function saveEditComment(comment_id) {
var editedContent = document.getElementById('editedContentComment' + comment_id).value;
console.log(comment_id);
console.log(editedContent);
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/comment/update` ,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       comment_id: comment_id,
       content: editedContent
   }),
   success: function (response) {
      
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
      console.log(response.message);
      getcomment();
   },
   error: function (error) {
       console.log(error);
       getcomment();
   },
});
//check xem day co phai comment cua minh hay la ko
  
}

function addNewReply(comment_id,post_id, parent_comment_id, own_id) {
const user_id = document.getElementById(`user_id`).value; 
var editedContent = document.getElementById('newReplyContent' + comment_id).value;
console.log(editedContent);
console.log(user_id);
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/comment/parentcommentpost`,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       user_id: user_id,
       post_id: post_id,
       parent_comment_id: parent_comment_id,
       content: editedContent,
       own_id: own_id
   }),
   success: function (response) {
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
       if (response.data != null) {
           //loadData();
          getcomment();
       } else {
           //loadData();
          getcomment();
           //showReplyForm(comment_id);
       }
   },
   error: function (error) {
       console.log(error);
       getcomment();
   },
});
}
function deleteComment(comment_id) {
const user_id = document.getElementById(`user_id`).value; 
console.log(user_id);
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/comment/checkuser`,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       user_id: user_id,
       comment_id: comment_id
       
   }),
   success: function (data) {
       console.log(data);
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
       if(data.status == 1){
           $.ajax({
               type: "POST",
               url: `http://localhost:8001/api/v1/comment/del`,
               headers: {
                   "Content-Type": "application/json"
               },
               data: JSON.stringify({
                   user_id: user_id,
                   comment_id: comment_id
                   
               }),
               success: function (response) {
                   console.log(response);
                   // Kiểm tra xem dữ liệu phản hồi có phải là null không
                   if (response.check === 1) {
                       alert(response.message);
                       getcomment();
                   } else {
                   getcomment();
                   }
               },
               error: function (error) {
                   console.log(error);
               },

           });
       }
       else{
           $.toast({
       heading: 'Bạn không được xóa bình luận của người khác',
       text: 'Bạn không được xóa bình luận của người khác',
       showHideTransition: 'fade',
       icon: 'error',
       hideAfter: 3000,
       loaderBg: '#fa6342',
       position: 'bottom-right',
   });
       }
   },
   error: function (error) {
       console.log(error);
   },

});

}
function loadLikeCount(){
const post_id = document.getElementById(`post_id`).value;
$.ajax({
   type: "GET",
   url: `http://localhost:8001/api/v1/post/${post_id}`,
   headers: {
       "Content-Type": "application/json"
   },
   
   success: function (response) {
       console.log("data" + response.data);
       if(response.data){
           $('#like_count').empty();
           let str = `
           <i class='bx bx-heart' onclick = "likepost(${response.data.id})" ></i>
           <div>${response.data.like_count}</div>
           `;
           $('#like_count').append(str);
       }
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
       
   },
   error: function (error) {
       console.log(error);
   },

});
}
function likepost(post_id){
const user_id = document.getElementById(`user_id`).value; 
const own_id = document.getElementById('own_id').value;
console.log(user_id);
$.ajax({
   type: "POST",
   url: `http://localhost:8001/api/v1/like/post`,
   headers: {
       "Content-Type": "application/json"
   },
   data: JSON.stringify({
       user_id: user_id,
       post_id: post_id,
       own_id: own_id
       
   }),
   success: function (response) {
      // console.log(response);
       loadLikeCount();
   },
   error: function (error) {
       console.log(error);
   },

});
}
loadLikeCount();
const listTag = [];
function loadtype(){
const id = document.getElementById("post_id").value;
console.log(id);
$.ajax({
   type: "GET",
   url: "http://localhost:8001/api/v1/post/tag/"+id,
   
   success: function (response) {
       response.data.forEach(type => {
           listTag.push(type.tag_id);
      });
      console.log(listTag);
       // Kiểm tra xem dữ liệu phản hồi có phải là null không
       let $str = response.data.map(function (type) {
               return `
               <a href = "/tag/${type.tag_id}" class="btn btn-xs btn-primary"> ${type.name_tag}</a>
           `;
       });
       
       $("#type").html($str);
         //console.log(str);
         $.ajax({
   
           type: "POST",
           url: `http://localhost:8001/api/v1/posts/get-by-tag`,
           headers: {
               "Content-Type": "application/json"
           },
           data: JSON.stringify({
               tag: listTag
               
           }),
           success: function (response) {
           console.log(response.message);
           for (const post of response.data) {
             let str = `
             <div class="col-md">
                     <div class="card mb-3">
                       <div class="row g-0">
                         <div class="col-md-4">
                           <a href = "/post/${post.id}"></a>
                           <img class="card-img card-img-left" src="/img/${post.images}" alt="Card image">
                         </div>
                         <div class="col-md-8">
                           <div class="p-2">
                             <a href = "/post/${post.id}">
                               <h5 aria-label="${post.title}" data-cooltipz-dir="bottom" class="card-title" style ="font-size: 14px;" onclick = "handleViewPost(${post.id})">${post.title}</h5>
                             </a>
                             <p class="" style = "margin-bottom:0px; font-size:12px;">
                               ${shortenHtmlText(post.body,50)} 
                             </p>
                             <a href = "/user/${post.user_id}">
                               <p class="card-text"><small class="text-muted">Người đăng ${post.full_name}</small></p>
                             </a>
                            
                             <p class="card-text"><small class="text-muted">${countTime(post.created_at)}</small></p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
           `;
           $('#list_post').append(str);
           }
               
           },
           error: function (error) {
               console.log(error);
           },

       });
   },
   error: function (error) {
       console.log(error);
   },

});
}
loadtype();
function handleViewPost(id){
    $.ajax({
      url: `http://localhost:8001/api/v1/post/updateview`,
      method: "POST",
      dataType: "json",
      data: {id: id},
      success: function(data) {
        //alert(data.message);
                        
      },
      error: function(err) {
        alert(err.responseText);
      }
    });
    //alert(id);
  }
function shortenHtmlText(htmlText, maxLength) {
let tempElement = document.createElement('div');
tempElement.innerHTML = htmlText;

let text = tempElement.textContent || tempElement.innerText || '';

if (text.length <= maxLength) {
return htmlText;
} else {
let shortText = text.substring(0, maxLength - 3) + "...";
tempElement.textContent = shortText;
return tempElement.innerHTML;
}
}
function shortenTextByWords(text, maxWords) {
// Tách văn bản thành các từ dựa trên khoảng trắng
let words = text.split(/\s+/);

// Nếu số từ ít hơn hoặc bằng số từ tối đa, trả về văn bản gốc
if (words.length <= maxWords) {
return text;
}

// Lấy 50 từ đầu tiên và thêm dấu ba chấm
let shortenedText = words.slice(0, maxWords).join(' ') + '...';

return shortenedText;
}
function countTime(created_at_string) {
let created_at = new Date(created_at_string);
let now = new Date();

let timeDifference = now - created_at; // Khoảng thời gian ở dạng miligisecond

let minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Chuyển đổi sang phút
let hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Chuyển đổi sang giờ
let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Chuyển đổi sang ngày

let result;

if (daysDifference > 0) {
   result = daysDifference + (daysDifference === 1 ? " ngày trước" : " ngày trước");
} else if (hoursDifference > 0) {
   result = hoursDifference + (hoursDifference === 1 ? " giờ trước" : " giờ trước");
} else {
   result = minutesDifference + (minutesDifference === 1 ? " phút trước" : " phút trước");
}

return result;
}
function shortenTextByWords(text, maxWords) {
// Tách văn bản thành các từ dựa trên khoảng trắng
let words = text.split(/\s+/);

// Nếu số từ ít hơn hoặc bằng số từ tối đa, trả về văn bản gốc
if (words.length <= maxWords) {
return text;
}

// Lấy 50 từ đầu tiên và thêm dấu ba chấm
let shortenedText = words.slice(0, maxWords).join(' ') + '...';

return shortenedText;
}