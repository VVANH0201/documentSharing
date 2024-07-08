function getcomment(){
    const document_id = document.getElementById(`document_id`).value;
    //const document_id = id;
    $.ajax({
        url: `http://localhost:8001/api/v1/comment/document/${document_id}`, // Replace with your actual API endpoint URL
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
                        <button class=" btn" id="saveButton" onclick="saveEditComment(${comment.id},${comment.document_id})" >Sửa</button>
                        </div>
                        <div class="inline-itms">
                            <span>${countTime(comment.created_at)}</span>
                            <a class="we-reply" onclick="showReplyForm(${comment.id})" title="Reply"><i class='bx bx-reply'></i></i></a>
                            <a onclick = "likecomment(${comment.id}, ${comment.user_id})" title=""><i class='bx bx-heart' ></i></i><span>${comment.like_count} </span></a>
                            <ul id="nestedComments${comment.id}" class="nested-comments" style="display: none;">

                            </ul>
                            <div id="replyForm${comment.id}" class = "mt-2" style="display: none;">
                                <textarea id="newReplyContent${comment.id}" class="comment_textarea_reply" placeholder=""></textarea>
                                <button class="post-btn btn " onclick="addNewReply(${comment.id},${comment.document_id},${comment.id}, ${comment.user_id})">Trả lời</button>
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
                        <button class=" btn" id="saveButton" onclick="saveEditComment(${comment.id})" >Sửa</button>
                        </div>
                        <div class="inline-itms">
                            <span>${countTime(comment.created_at)}</span>
                            <a class="we-reply" onclick="showReplyForm(${comment.id})" title="Reply"><i class='bx bx-reply'></i></i></a>
                            <a onclick = "likecomment(${comment.id}, ${comment.user_id})" title=""><i class='bx bx-heart' ></i></i><span>${comment.like_count} </span></a>
                            <ul id="nestedComments${comment.id}" class="nested-comments" style="display: none;">

                            </ul>
                            <div id="replyForm${comment.id}" class ="mt-2" style="display: none;">
                                <textarea id="newReplyContent${comment.id}" class="comment_textarea_reply" placeholder=""></textarea>
                                <button class="post-btn" onclick="addNewReply(${comment.id},${comment.document_id},${comment.id},${comment.user_id})">Trả lời</button>
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
function likecomment(comment_id, own_id){
const user_id = document.getElementById(`user_id`).value; 
//const own_id = document.getElementById('own_id').value;
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
function newcomment(user_id, document_id,own_id){
var content = document.getElementById("myInput").value;
console.log(content);
var requests = {
    "url": `http://localhost:8001/api/v1/comment/document`,
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    },
    "data": JSON.stringify({
        "user_id": user_id,
        "document_id": document_id,
        "content": content,
        "own_id" : own_id
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

function addNewReply(comment_id,document_id, parent_comment_id,own_id) {
const user_id = document.getElementById(`user_id`).value; 
var editedContent = document.getElementById('newReplyContent' + comment_id).value;
console.log(editedContent);
console.log(user_id);
$.ajax({
    type: "POST",
    url: `http://localhost:8001/api/v1/comment/parentcomment`,
    headers: {
        "Content-Type": "application/json"
    },
    data: JSON.stringify({
        user_id: user_id,
        document_id: document_id,
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
loadDocument();
function loadDocument(){
const document_id = document.getElementById(`document_id`).value;
$.ajax({
    type: "GET",
    url: `http://localhost:8001/api/v1/document/${document_id}`,
    headers: {
        "Content-Type": "application/json"
    },
    
    success: function (response) {
        console.log("data" + response.data);
        if(response.data){
            $('#like_count').empty();
            let str = `
            <i style="color: red;" class='bx bx-heart' onclick = "likedocument(${response.data.id})" ></i>
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
function likedocument(document_id){
const user_id = document.getElementById(`user_id`).value; 
const own_id = document.getElementById('own_id').value;
console.log(user_id);
$.ajax({
    type: "POST",
    url: `http://localhost:8001/api/v1/like/document`,
    headers: {
        "Content-Type": "application/json"
    },
    data: JSON.stringify({
        user_id: user_id,
        document_id: document_id,
        own_id: own_id
        
    }),
    success: function (response) {
       // console.log(response);
       
        loadDocument();
    },
    error: function (error) {
        console.log(error);
    },

});
}
function download_file(document_id,id, path){

try {
    const loading = document.getElementById('showloading');
    loading.style.display = 'block';
    $.ajax({
    url: `http://localhost:8001/api/v1/download-file`,
    method: "POST",
    dataType: "json",
    data: {document_id: document_id, id: id,path: path},
    success: function(data) {
        
    alert(data.message);
    loading.style.display = "none";  
    location.reload();
    },
    error: function(err) {
        
    alert(err.responseText);
    }
});
} catch (error) {
    
} finally{
    loading.style.display = "none";
}

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
function loadDocumentByTypeID(){
const type_id = document.getElementById('type_id').value;
  $.ajax({
    type: "GET",
    url: "http://localhost:8001/api/v1/documents/getbytype"+ "?id="+type_id+"&limit=4",

    success: function (response) {
        // Kiểm tra xem dữ liệu phản hồi có phải là null không
        if (response.data != null) {
            console.log(response.data);
            
            for (const document of response.data) {
              let str = `
              <div class="mb-3" >
                <input type="text" value="${document.link}" hidden class="link_file">
                

                    <div class="card bg-white border-white border-0">
                      <a aria-label="${document.title}" data-cooltipz-dir="bottom" href="/document/view/${document.id}" onclick = "handleViewDocument(${document.id})">
                        <div class = "d-flex justify-content-center">
                          <img class="card-custom-img" id="pdfImage1${document.id}" alt="PDF to Image">
                          
                        </div>
                        <div class="title">
                          <div class="d-flex align-items-center justify-content-between">
                            <span class ="text_size">${shortenTextByWords(document.title,10)}</span>
                          </div> 
                        
                       
                      </div>
                      </a>
                      <div class="" style="background: inherit; border-color: inherit;">
                        <div class="d-flex align-items-center m-2" >
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i style="color: red;" class='bx bx-heart'></i>
                                <div class="text-muted">${document.like_count}</div>
                            </div>
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                              <i class='bx bx-memory-card'></i>
                              <div class="text-muted"> ${document.file_type}</div>
                            </div>
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i class='bx bxs-download' ></i>
                                <div class="text-muted">${document.download_count}</div>
                            </div> 
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i class='bx bx-show'></i>
                                <div class="text-muted">${document.view_count}</div>
                            </div>
                            
                        </div>
                      </div>
                        
                        
                        
                            
                        
                    </div>
                      
                    
                </div>
            `;
            $('#list_document').append(str);
            }   
            for (const document of response.data) {
              displayFirstPage(document.link, "pdfImage1"+document.id);
            }          
        }
        else{
        }
    },
    error: function (error) {
        console.log(error);
    },
});
}
loadDocumentByTypeID();
function loadDocumentByUserID(){
const user_id = document.getElementById('own_id').value;
console.log(user_id);
  $.ajax({
    type: "GET",
    url: "http://localhost:8001/api/v1/documents/get-by-user"+ "?id="+user_id+"&limit=5",

    success: function (response) {
        // Kiểm tra xem dữ liệu phản hồi có phải là null không
        if (response.data != null) {
            console.log(response.data);
            document.getElementById('text_list_document_user').style.display = 'block';
            for (const document of response.data) {
              let str = `
              <div class="mb-3" >
                <input type="text" value="${document.link}" hidden class="link_file">
                

                    <div class="card bg-white border-white border-0">
                      <a aria-label="${document.title}" data-cooltipz-dir="bottom" href="/document/view/${document.id}" onclick = "handleViewDocument(${document.id})">
                        <div class = "d-flex justify-content-center">
                          <img class="card-custom-img" id="pdfImage${document.id}" alt="PDF to Image">
                          
                        </div>
                        <div class="title">
                          <div class="d-flex align-items-center justify-content-between">
                            <span class ="text_size">${shortenTextByWords(document.title,10)}</span>
                          </div> 
                        
                       
                      </div>
                      </a>
                      <div class="" style="background: inherit; border-color: inherit;">
                        <div class="d-flex align-items-center m-2" >
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i style="color: red;" class='bx bx-heart'></i>
                                <div class="text-muted">${document.like_count}</div>
                            </div>
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                              <i class='bx bx-memory-card'></i>
                              <div class="text-muted"> ${document.file_type}</div>
                            </div>
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i class='bx bxs-download' ></i>
                                <div class="text-muted">${document.download_count}</div>
                            </div> 
                            <div class="d-flex align-items-center" style = "margin-right:10px">
                                <i class='bx bx-show'></i>
                                <div class="text-muted">${document.view_count}</div>
                            </div>
                            
                        </div>
                      </div>
                        
                        
                        
                            
                        
                    </div>
                      
                    
                </div>
            `;
            $('#list_document_user').append(str);
            }   
            for (const document of response.data) {
              displayFirstPage(document.link, "pdfImage"+document.id);
            }          
        }
        else{
        }
    },
    error: function (error) {
        console.log(error);
    },
});
}
loadDocumentByUserID();


// Khởi tạo PDF.js


// loadingTask.promise.then(pdf => {
//   const totalPages = pdf.numPages;
//   const pagesToShow = Math.min(10, totalPages);  // Chỉ hiển thị số trang có sẵn hoặc 10 trang

//   const pagesPromises = [];
//   for (let pageNum = 1; pageNum <= pagesToShow; pageNum++) {
//     pagesPromises.push(pdf.getPage(pageNum));
//   }
//   return Promise.all(pagesPromises);
// }).then(pages => {
//   const pdfContainer = document.getElementById('pdfContainer');

//   pages.forEach((page, index) => {
//     const viewport = page.getViewport({ scale: 1 });
    
//     // Tạo canvas cho từng trang
//     const canvas = document.createElement('canvas');
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;
//     pdfContainer.appendChild(canvas);

//     const context = canvas.getContext('2d');
    
//     // Vẽ nội dung của trang
//     page.render({
//       canvasContext: context,
//       viewport: viewport
//     }).promise.then(() => {
//       // Làm mờ toàn bộ nội dung từ trang số 2 trở đi
//       if (index >= 5) { // Chỉ làm mờ từ trang thứ 2 trở đi (index bắt đầu từ 0)
//         context.globalAlpha = 1;  // Đặt độ trong suốt để làm mờ nội dung
//         context.fillStyle = "white";
//         context.fillRect(0, 0, canvas.width, canvas.height);
        
//         // context.globalAlpha = 1.0;  // Đặt lại độ trong suốt cho chữ
//       }

//       // Viết chữ 'tailieu' màu đỏ chéo
//       context.font = "bold 48px Arial";
//       context.fillStyle = "red";
//       context.translate(canvas.width / 2, canvas.height / 2);
//       context.rotate(-Math.PI / 4);  // Xoay chữ 45 độ
//       context.fillText("tailieu", -context.measureText("tailieu").width / 2, 0);
//       context.setTransform(1, 0, 0, 1, 0, 0);  // Đặt lại transform
//       context.strokeStyle = 'black';  // Adjust border color as needed
//     context.lineWidth = 2;        // Adjust border width as needed
//     context.strokeRect(0, 0, canvas.width, canvas.height);
//     context.font = "bold 12px Arial";
//   context.fillStyle = "black";
//   context.textAlign = "center";
//   context.fillText(`Trang ${index + 1}`, canvas.width / 2, canvas.height - 10);
//     });
//   });
// }).catch(error => {
//   console.error('Lỗi khi tải PDF: ', error);
// });
const link = document.getElementById('link').value;

const pdfUrl = 'http://localhost:8001/img/' + link;
const loadingTask = pdfjsLib.getDocument(pdfUrl);
console.log(pdfUrl);
let pdfDoc = null;
let currentPage = 1;
const pagesToShow = 5;
let clickCounter = 0; // Counter for button clicks
//const loadingTask = pdfjsLib.getDocument(url);

loadingTask.promise.then(pdf => {
  pdfDoc = pdf;
  loadPages();
}).catch(error => {
  console.error('Error loading PDF: ', error);
});

function loadPages() {
  const totalPages = pdfDoc.numPages;
  const pagesToLoad = Math.min(currentPage + pagesToShow - 1, totalPages);

  const pagesPromises = [];
  for (let pageNum = currentPage; pageNum <= pagesToLoad; pageNum++) {
    pagesPromises.push(pdfDoc.getPage(pageNum));
  }

  Promise.all(pagesPromises).then(pages => {
    const pdfContainer = document.getElementById('pdfContainer');

    pages.forEach((page, index) => {
      const viewport = page.getViewport({ scale: 1 });

      // Create canvas for each page
      const canvas = document.createElement('canvas');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      pdfContainer.appendChild(canvas);

      const context = canvas.getContext('2d');
   

      // Render page content
      page.render({
        canvasContext: context,
        viewport: viewport
      }).promise.then(() => {
        // Blur content for pages after the first 5 pages
        // if (currentPage + index > 5) {
        //   context.globalAlpha = 0.5;
        //   context.fillStyle = "white";
        //   context.fillRect(0, 0, canvas.width, canvas.height);
        // }

        // Write 'tailieu' diagonally in red
        // context.font = "bold 48px Arial";
        // context.fillStyle = "red";
        // context.translate(canvas.width / 2, canvas.height / 2);
        // context.rotate(-Math.PI / 4);
        // context.fillText("tailieu", -context.measureText("tailieu").width / 2, 0);
        // context.setTransform(1, 0, 0, 1, 0, 0);
           context.font = "bold 48px Arial";
      context.fillStyle = "rgba(173, 216, 230, 0.5)"; // Light blue color with some transparency
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(-Math.PI / 4);
      context.fillText("document", -context.measureText("document").width / 2, 0);
      context.setTransform(1, 0, 0, 1, 0, 0);

        // Add border and page number
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.font = "bold 12px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText(`Trang ${currentPage + index - pagesToShow }`, canvas.width / 2, canvas.height - 10);
      });
    });

    currentPage += pagesToShow;

    // Show the "See More" button if there are more pages to load
    if (currentPage <= totalPages  && clickCounter < 2) {
      document.getElementById('seeMoreButton').style.display = 'block';
    } else {
      document.getElementById('seeMoreButton').style.display = 'none';
    }
  });
}

document.getElementById('seeMoreButton').addEventListener('click', () => {
  clickCounter++;
  loadPages();
});

function report(){
    const user_id = document.getElementById(`user_id`).value; 
    const document_id = document.getElementById(`document_id`).value;
    const report_reason= document.getElementById('report_reason').value;
    $.ajax({
        type: "POST",
        url: `http://localhost:8001/api/v1/report` ,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            user_id: user_id,
            document_id: document_id,
            report_reason: report_reason
        }),
        success: function (response) {
        
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
        console.log(response.message);
        alert(response.message);
        location.reload();
        //getcomment();
        },
        error: function (error) {
            console.log(error);
            //getcomment();
        },
    });
}
function displayFirstPage(pdfFilePath, imgId) {
const pdfUrl = 'http://localhost:8001/img/' + pdfFilePath;
        const img = document.getElementById(imgId);

        // Khởi tạo PDFJS
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            // Lấy trang đầu tiên
            pdf.getPage(1).then(page => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                // Tạo canvas để vẽ trang PDF
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
               

                // Vẽ trang PDF lên canvas
                page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise.then(() => {
                    // Chuyển đổi canvas thành ảnh và hiển thị trong thẻ img
                    const imgData = canvas.toDataURL('image/jpeg');
                    
                      img.src = imgData;
                    
                   
                      
                    
                    
                });
            });
        }).catch(error => {
          img.src = "http://localhost:8001/asset/img/document.jpg";
});
}