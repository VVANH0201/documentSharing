function getData() {
    var inputs = document.getElementsByClassName("num");
    var inputValues = [];
    console.log(inputs.length);

    for (var i = 0; i < inputs.length; i++) {
        inputValues.push(inputs[i].value);
        loadtype(inputs[i].value);
    }
    
    console.log(inputValues);
}
loadPostByView();


function loadtypes(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/types",
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            if (response.data != null) {
                let $str = response.data.map(function (types) {
                    return `<a type="button" class="btn rounded-pill btn-sm btn-secondary m-3" href="/types/${types.id}">${types.name}</a> `; 
                })
                $('#listtype1').html($str);
            }
        },
        error: function (error) {
            console.log(error);
        },

    });
    $(document).ready(function(){
      $('.your-class').slick({
        infinite: true,
  slidesToShow: 5,
  slidesToScroll: 5,
  prevArrow: `<p class="page-item prev">
                              <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                            </p>`,
    nextArrow: `<p class="page-item next">
                              <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                            </p>`
      });
    });

}
loadtypes();
function handleViewDocument(id){
  $.ajax({
    url: `http://localhost:8001/api/v1/document/updateview`,
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
function loadPostByView(){
      $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/posts/get-by-view",

        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            if (response.data != null) {
                console.log(response.data);
                let count = response.length;
                for (const post of response.data) {
                  let str = `
                  <div class="col-xs-12 col-sm-4 col-lg-4" style="padding-bottom: 10px;">
                        <div class="card">
                            <a class="img-card" href="/post/${post.id}">
                            <img src="/img/${post.images}" />
                          </a>
                            <div class="card-content">
                                <h5 class="card-title">
                                  <a style = "font-size:13px" href="/post/${post.id}" aria-label="${post.title}" data-cooltipz-dir="bottom" onclick = "handleViewPost(${post.id})"> ${shortenHtmlText(post.title,32)}
                                  </a>
                                </h5>
                                <p style="margin-bottom: 0; font-size:12px;text-align: justify;" >
                                  ${shortenHtmlText(post.body,80)}
                                </p>
                                <ul class="postcard__tagbox" style="margin: 0 5 0 0px;" id ="tags${post.id}">
                                   
                                  </ul>
                                  <input type="text" value="${post.id}" class="num" name = "num" hidden >
                            </div>
                            
                            
                        </div>
                    </div>
                  
                 
                `;
                $('#list_post').append(str);
                }
                getData();             
            }
            else{
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}
function loadPostByTime(){
      $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/posts/get-by-time",

        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            if (response.data != null) {
                console.log(response.data);
                let count = response.length;
                for (const post of response.data) {
                  let str = `
                  <div class="col-md">
                          <div class="card mb-3">
                            <div class="row g-0">
                              <div class="col-md-4">
                                <a href = "/post/${post.id}"></a>
                                <img class="card-img card-img-left" src="./img/${post.images}" alt="Card image">
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
                $('#list_post_time').append(str);
                }
                getData();             
            }
            else{
            }
        },
        error: function (error) {
            console.log(error);
        },
    });
}
loadPostByTime();
function loadDocumentByTime(){
    $.ajax({
      type: "GET",
      url: "http://localhost:8001/api/v1/documents/getbytime",

      success: function (response) {
          // Kiểm tra xem dữ liệu phản hồi có phải là null không
          if (response.data != null) {
              console.log(response.data);
              let count = response.length;
              for (const document of response.data) {
                let str = `
                <div class="col-md-4 col-lg-3 mb-3" >
                  <input type="text" value="${document.link}" hidden class="link_file">
                  

                      <div class="card bg-white border-white border-0">
                        <a aria-label="${document.title}" data-cooltipz-dir="bottom" href="/document/view/${document.id}" onclick = "handleViewDocument(${document.id})">
                          <div class = "d-flex justify-content-center">
                            <img class="card-custom-img" id="pdfImage1${document.id}" alt="PDF to Image">
                            
                          </div>
                          <div  class="title">
                            <div class="d-flex align-items-center justify-content-between">
                              <span  class ="text_size">${shortenTextByWords(document.title,10)}</span>
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
                                  <i style="color: #23d2e2;" class='bx bx-show'></i>
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
loadDocumentByTime();
function loadDocumentByView(){
    $.ajax({
      type: "GET",
      url: "http://localhost:8001/api/v1/documents/getbyview",

      success: function (response) {
          // Kiểm tra xem dữ liệu phản hồi có phải là null không
          if (response.data != null) {
              console.log(response.data);
              
              for (const document of response.data) {
                let str = `
                <div class="col-md-4 col-lg-3 mb-3" >
                 
                  

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
                                  <i style="color: #23d2e2;" class='bx bx-show'></i>
                                  <div class="text-muted">${document.view_count}</div>
                              </div>
                              
                          </div>
                        </div>
                          
                          
                          
                              
                          
                      </div>
                        
                      
                  </div>
              `;
              $('#list_document1').append(str);
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
loadDocumentByView();
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
function loadtype(id){
  //const list = document.getElementsByClassName("${id}")
  $.ajax({
      type: "GET",
      url: "http://localhost:8001/api/v1/post/tag/"+id,
      
      success: function (response) {
        console.log("sss");
          // Kiểm tra xem dữ liệu phản hồi có phải là null không
          let $str = response.data.map(function (type) {
                  return `
                  
                  <li class="tag__item">
                    <a href = "/tag/${type.tag_id}">
                      ${type.name_tag}
                    </a>
                    
                  </li>
              `;
              });
          
            $("#tags" + id).html($str);
            //console.log(str);
      },
      error: function (error) {
          console.log(error);
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
const apiUrl = 'http://localhost:8001/api/v1/admin/topUser';

    // Sử dụng fetch để gọi API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Lấy phần tử đầu tiên của user_post và user_document
            const topUserPost = data.user_post[0];
            const topUserDocument = data.user_document[0];

            // Gán dữ liệu vào thẻ <p> tương ứng
            document.getElementById('user-post').innerText = `Người dùng đăng bài viết nhiều nhất: ${topUserPost.user_name}  `+ "  -  " +`Số lượng: ${topUserPost.post_count}                                                    Người dùng đăng tài liệu nhiều nhất: ${topUserDocument.user_name}  -  Số lượng: ${topUserDocument.document_count}      `;
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });