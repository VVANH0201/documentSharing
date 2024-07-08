function search(){
    const inputElement = document.getElementById('input_search');
              const searchText = inputElement.value;
              
              // Lấy giá trị từ select
              const selectElement = document.getElementById('select');
              const selectedValue = selectElement.value;
    if(selectedValue == 1){
      hanldsearch(searchText);
    }
    if(selectedValue == 2){
      hanldsearchPost(searchText);
    }
    if(selectedValue == 3){
      hanldsearchUser(searchText);
    }
    if(!selectedValue){
      hanldsearch(searchText);
    }
  }
        
      function hanldsearch(kw){
        const selectElement = document.getElementById('types');
        selectElement.hidden = false;
        //let kw = document.getElementById(`input_search`).value; 
        const sort = document.getElementById('sort');
       // alert(kw);
      $.ajax({
          type: "POST",
          url: "http://localhost:8001/api/v1/search?name=" + kw,
          
          success: function (response) {
              var moreclass = document.getElementById("addmoreclass");
  
              let num = response.length;
             console.log(num);
             
  
              moreclass.classList.add("card");
              // Kiểm tra xem dữ liệu phản hồi có phải là null không
              $('#list_search').empty(); // Clear existing comments (optional)
              $('#num').empty();
              if (response.data != null) {
                  console.log(response.data);
                  let count = response.length;
                  
                  $('#num').append(`Kết quả (` + num + `)`);
                  for (const document of response.data) {
                    let str2 = `
                    <div >
                    <div class="card mb-3">
                    
                      
                      <div class="row g-0 d-flex">
                        <div class="col-md-2" style = "text-align: center;">
                          <img class="card-custom-img" id="pdfImage1${document.id}" alt="PDF to Image">
                        </div>
                        <div class="col-md-10">
                          <div class ="">
                        <a href="/document/view/${document.id}" style=" cursor: pointer; ">
                        <h5 aria-label="${document.title}" data-cooltipz-dir="bottom" style="color:rgb(124, 199, 245) ; margin-bottom: 0; padding: 5px;" >${document.title}</h5>
                      </a>
                      </div >
                          <div style="text-align: justify; padding:5px;" >
                            
                              
                           
                            <br>
                            <a href="/user/${document.user_id}">${document.full_name}</a>
                              <div class="d-flex align-items-center m-2" >
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bx-heart'></i>
                                      <div class="text-muted">${document.like_count}</div>
                                  </div>
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bxs-download' ></i>
                                      <div class="text-muted">${document.download_count}</div>
                                  </div> 
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bx-show'></i>
                                      <div class="text-muted">${document.view_count}</div>
                                  </div>
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bxs-calendar'></i>
                                      <div class="text-muted">${countTime(document.created_at)}</div>
                                  </div>
                              </div>
  
                              <div class="d-flex align-items-center justify-content-between m-2">
                                  
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    `;
                    
                  $('#list_search').append(str2);
                  }
                  for (const document of response.data) {
                    displayFirstPage(document.link, "pdfImage1"+document.id);
                  }  
                  //document.getElementById('defaultSelect').hidden = false;
              }
              else{
                $('#list_search').empty(); // Clear existing comments (optional)
                $('#num').empty();
                $('#num').append(`Kết quả (0)`);
                $('#list_search').append("Không có tài liệu nào trùng với từ khóa " + kw); // Clear existing comments (optional)
              }
          },
          error: function (error) {
              console.log(error);
          },
  
      });
      
  
  }
  function loadfollowing(id){
      //const id = document.getElementById('user_id').value;
      $.ajax({
          type: "GET",
          url: "http://localhost:8001/api/v1/user/following/"+id,
          
          success: function (response) {
              // Kiểm tra xem dữ liệu phản hồi có phải là null không
              // 
              let num = response.num;
              $('#following'+id).append('Số người theo dõi: '+num);
          },
          error: function (error) {
              console.log(error);
          },
  
      });
    }
  function hanldsearchUser(kw){
    const selectElement = document.getElementById('types');
    selectElement.hidden = true;
        //let kw = document.getElementById(`input_search`).value; 
       
       // alert(kw);
      $.ajax({
          type: "GET",
          url: "http://localhost:8001/api/v1/user/find?kw=" + kw,
          
          success: function (response) {
              var moreclass = document.getElementById("addmoreclass");
  
              let num = response.length;
             console.log(num);
             
  
              moreclass.classList.add("card");
              // Kiểm tra xem dữ liệu phản hồi có phải là null không
              $('#list_search').empty(); // Clear existing comments (optional)
              $('#num').empty();
              if (response.data != null) {
                  console.log(response.data);
                  let count = response.length;
                  
                  $('#num').append(`Kết quả (` + num + `)`);
                  for (const user of response.data) {
                    let str2 = `
                    <div class="col-md-4">
                                              <div class="card mb-3">
                                                <div class="row g-0">
                                                  <div class="col-md-4">
                                                    <img class="card-img card-img-left p-3" src="/img/${user.avatar_url}" alt="Card image">
                                                  </div>
                                                  <div class="col-md-8">
                                                    <div class="card-body">
                                                      <a href="/user/${user.id}" style="cursor: pointer;">
                                                          <h5 class="card-title">${user.full_name}</h5>
                                                      </a>
                                                      <input type="text" value="${user.id}" class="numid" id="" hidden>
                                                      <p class="card-text" id="following${user.id}">
                                                     
                                                      </p>
                                                      
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                          </div>
                    `;
                    
                  $('#list_search').append(str2);
  
                  }
                  getData();
              }
              else{
                $('#list_search').empty(); // Clear existing comments (optional)
                $('#num').empty();
                $('#num').append(`Kết quả (0)`);
                $('#list_search').append("Không có người dùng nào trùng với từ khóa " + kw); // Clear existing comments (optional)
              }
          },
          error: function (error) {
              console.log(error);
          },
  
      });
    }
    function hanldsearchPost(kw){
      const selectElement = document.getElementById('types');
      selectElement.hidden = true;
        //let kw = document.getElementById(`input_search`).value; 
       
       // alert(kw);
      $.ajax({
          type: "GET",
          url: "http://localhost:8001/api/v1/posts/find?kw=" + kw,
          
          success: function (response) {
              var moreclass = document.getElementById("addmoreclass");
  
              let num = response.length;
             console.log(num);
             
  
              moreclass.classList.add("card");
              // Kiểm tra xem dữ liệu phản hồi có phải là null không
              $('#list_search').empty(); // Clear existing comments (optional)
              $('#num').empty();
              if (response.data != null) {
                  console.log(response.data);
                  let count = response.length;
                  
                  $('#num').append(`Kết quả (` + num + `)`);
                  for (const post of response.data) {
                    let str2 = `
                    <div class="d-flex mb-3 p-3">
                                <div class="flex-shrink-0">
                                  <img src="/img/${post.images}"  class="me-3" height="100" width="120">
                                </div>
                                <div class="flex-grow-1 row">
                                  <div class="col-12  mb-sm-0 mb-2">
                                    <div class="d-flex">
                                      <h5 class="mb-0" style="color: rgb(69, 84, 244);">${post.full_name}</h5>
                                      <h5 class="text-muted " style="margin-left: 5px;" data-bs-toggle="tooltip" data-bs-offset="0,4" data-bs-placement="bottom" data-bs-html="true" title="" 
                                        data-bs-original-title="${convertISOToDateVN(post.created_at)} </span>">
                                        <span>${convertISOToDateVN(post.created_at)} </span>
                                      </h5>
                                      
                                    </div>
                                    <div class="row">
                                      <div class="col-md">
                                        <a  href="/post/${post.id}">
                                          <h5 aria-label="${post.title}" data-cooltipz-dir="bottom">${post.title}</h5>
                                        </a>
                                         <p class="" style = "margin-bottom:0px; font-size:14px;">
                                          ${shortenHtmlText(post.body,230)} 
                                        </p>
                                        
                                      </div>
        
                                      <!-- <div class="col-6 load ${post.id}" id="type${post.id}" onload="loadtype(${post.id})">
                                        
                                      </div> -->
                                      
                                    </div>
                                    <div class="d-flex">
                                
                                      <p>
                                        <i class='bx bx-heart'></i>
                                        <span>${post.like_count}</span>
                                      </p>
                                    </div>
                                    <hr class="m-0">
                                    
                                  </div>
                                  <!-- <div class="col-4 col-sm-5 text-end">
                                    <button type="button" class="btn btn-icon btn-outline-secondary">
                                      <i class="bx bx-link-alt"></i>
                                    </button>
                                  </div> -->
                                </div>
                              </div>
                    `;
                    
                  $('#list_search').append(str2);
  
                  }
                  getData();
              }
              else{
                $('#list_search').empty(); // Clear existing comments (optional)
                $('#num').empty();
                $('#num').append(`Kết quả (0)`);
                $('#list_search').append("Không có bài viết nào trùng với từ khóa " + kw); // Clear existing comments (optional)
              }
          },
          error: function (error) {
              console.log(error);
          },
  
      });
    }
    function getData() {
      var inputs = document.getElementsByClassName('numid');
      var inputValues = [];
  
      for (var i = 0; i < inputs.length; i++) {
          inputValues.push(inputs[i].value);
          loadfollowing(inputs[i].value);
          
      }
      console.log(inputValues);
      
      // Sử dụng mảng inputValues ở đây
  }
  
    function hanldsearchsort(sort,kw){
    
        //console.log(kw); 
        //const sort = document.getElementById('sort');
        //alert(kw);
        
      $.ajax({
          type: "POST",
          url: "http://localhost:8001/api/v1/search?name=" + kw + "&sort="+sort,
          
          success: function (response) {
              // Kiểm tra xem dữ liệu phản hồi có phải là null không
              $('#list_search').empty(); // Clear existing comments (optional)
              $('#num').empty();
              if (response.data != null) {
                  console.log(response.data);
                  let count = response.length;
                  let num = response.length;
             console.log(num);
             
                  $('#num').append(`Kết quả (` + count + `)`);
                  for (const document of response.data) {
                    let str = `
                    <div >
                    <div class="card mb-3">
                    
                      
                      <div class="row g-0 d-flex">
                        <div class="col-md-2" style = "text-align: center;">
                          <img class="card-custom-img" id="pdfImage1${document.id}" alt="PDF to Image">
                        </div>
                        <div class="col-md-10">
                          <div class ="">
                        <a href="/document/view/${document.id}" style=" cursor: pointer; ">
                        <h5 style="color:rgb(124, 199, 245) ; margin-bottom: 0; padding: 5px;" >${document.title}</h5>
                      </a>
                      </div >
                          <div style="text-align: justify; padding:5px;" >
                            
                              
                           
                            <br>
                            <a href="/user/${document.user_id}">${document.full_name}</a>
                              <div class="d-flex align-items-center m-2" >
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bx-heart'></i>
                                      <div class="text-muted">${document.like_count}</div>
                                  </div>
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bxs-download' ></i>
                                      <div class="text-muted">${document.download_count}</div>
                                  </div> 
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bx-show'></i>
                                      <div class="text-muted">${document.view_count}</div>
                                  </div>
                                  <div class="d-flex align-items-center" style="margin-right: 10px;">
                                      <i class='bx bxs-calendar'></i>
                                      <div class="text-muted">${countTime(document.created_at)}</div>
                                  </div>
                              </div>
  
                              <div class="d-flex align-items-center justify-content-between m-2">
                                  
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  `;
                  $('#list_search').append(str);
                  }
                  for (const document of response.data) {
                    displayFirstPage(document.link, "pdfImage1"+document.id);
                  }  
                
                  document.getElementById('defaultSelect').hidden = false;
              }
              else{
                $('#list_search').empty(); // Clear existing comments (optional)
                $('#num').empty();
                $('#num').append(`Kết quả (0)`);
                $('#list_search').append("Không có tài liệu nào trùng với từ khóa " + kw); // Clear existing comments (optional)
              }
          },
          error: function (error) {
              console.log(error);
          },
  
      });
    }
    function convertISOToDateVN(isoDate) {
      // Tạo đối tượng Date từ chuỗi ISO 8601
      const date = new Date(isoDate);
      
      // Lấy các thành phần ngày, tháng, năm
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Tháng được tính từ 0-11 nên cần cộng thêm 1
      const year = date.getUTCFullYear();
      
      // Đảm bảo ngày và tháng có 2 chữ số
      const dayStr = day < 10 ? '0' + day : day;
      const monthStr = month < 10 ? '0' + month : month;
      
      // Định dạng lại chuỗi ngày tháng theo định dạng ngày/tháng/năm
      const formattedDate = `${dayStr}/${monthStr}/${year}`;
      
      return formattedDate;
  }
  document.getElementById("defaultSelect").addEventListener("change", function() {
    let kw = document.getElementById(`input_search`).value;
    var selectedOption = this.value;
    console.log("Option " + selectedOption + " is selected.");
    console.log(kw);
    hanldsearchsort(selectedOption,kw);
   
  
  });
  // document.getElementById("select").addEventListener("change", function() {
  //   let kw = document.getElementById(`input_search`).value;
  //   var selectedOption = this.value;
  //   console.log("Option " + selectedOption + " is selected.");
  //   console.log(kw);
  //   if(selectedOption == 1){
  //     hanldsearch();
  //   }
  //   if(selectedOption == 2){
  //     hanldsearchPost();
  //   }
  //   if(selectedOption == 3){
  //     hanldsearchUser();
  //   }
  // });
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