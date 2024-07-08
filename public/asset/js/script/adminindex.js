const ctx = document.getElementById('myChart');
  function loadDataFromstatisticsByTag(){
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/statisticsByTag` ,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
           
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
          console.log(response.message);
          console.log(response.data);
          const tagGroups = [];
          const barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9"
            
          ];
          // Mảng lưu trữ tổng số bài viết của mỗi nhóm
          const postCounts = [];

          // Lặp qua mỗi đối tượng trong dữ liệu API
          response.data.forEach(item => {
              tagGroups.push(item.tag_group);
              postCounts.push(parseInt(item.total_posts)); // Chuyển đổi sang số nguyên
          });
          console.log(tagGroups);
          console.log(postCounts);
          new Chart("myChart", {
            type: "pie",
            data: {
              labels: tagGroups,
              datasets: [{
                backgroundColor: barColors,
                data: postCounts
              }]
            },
            options: {
              title: {
                display: true,
                text: "Thống kê theo tag"
              }
            }
          });

           
        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  function loadDataFromstatisticsByTypes(){
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/statisticsByTypes` ,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
           
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
          console.log(response.message);
          console.log(response.data);
          const type_group = [];
          const barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9"
            
          ];
          // Mảng lưu trữ tổng số bài viết của mỗi nhóm
          const total_documents = [];

          // Lặp qua mỗi đối tượng trong dữ liệu API
          response.data.forEach(item => {
              type_group.push(item.type_group);
              total_documents.push(parseInt(item.total_documents)); // Chuyển đổi sang số nguyên
          });
          console.log(type_group);
          console.log(total_documents);
          new Chart("myChart1", {
            type: "pie",
            data: {
              labels: type_group,
              datasets: [{
                backgroundColor: barColors,
                data: total_documents
              }]
            },
            options: {
              title: {
                display: true,
                text: "Thống kê theo danh mục"
              }
            }
          });

           
        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  function loadDataStatisticDay(){
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/user/statisticUser-day`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          
          const data = response.data;
          console.log(data);
          $('#total-user').empty();
          $('#statistic-user').empty();
          $('#total-user').append('Tổng số người dùng: ' + data[0].total_users);
          $('#statistic-user').append('Số người dùng mới trong ngày: ' + data[0].new_users_today);

        },
        error: function (error) {
            console.log(error);
           
        },
    });
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/post/statisticPost-day`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          
          const data = response.data;
          console.log(data);
          $('#total-post').empty();
          $('#statistic-post').empty();
          $('#total-post').append('Tổng số bài viết: ' + data[0].total_posts);
          $('#statistic-post').append('Số bài viết mới trong ngày: ' + data[0].new_posts_today);

        },
        error: function (error) {
            console.log(error);
           
        },
    });
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/docuemnt/statisticDocument-day`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          
          const data = response.data;
          console.log(data);
          $('#total-document').empty();
          $('#statistic-document').empty();
          $('#total-document').append('Tổng số tài liệu: ' + data[0].total_documents);
          $('#statistic-document').append('Số tài liệu mới trong ngày: ' + data[0].new_documents_today);

        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  function loadDataStatisticMonth(){
    $.ajax({
        type: "POST",
        url: `http://localhost:8001/api/v1/admin/StatisticsForMonth`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          
          const user = response.user;
          const post = response.post;
          const document = response.document;
          $('#total-user').empty();
          $('#statistic-user').empty();
          $('#total-post').empty();
          $('#statistic-post').empty();
          $('#total-document').empty();
          $('#statistic-document').empty();
          $('#total-user').append('Tổng số người dùng: ' + user[0].total_users);
          $('#statistic-user').append('Số người dùng mới trong tháng: ' + user[0].new_users_this_month);

          $('#total-post').append('Tổng số bài viết: ' + post[0].total_posts);
          $('#statistic-post').append('Số bài viết mới trong tháng: ' + post[0].new_posts_this_month);

          $('#total-document').append('Tổng số tài liệu: ' + document[0].total_docuemnts);
          $('#statistic-document').append('Số tài liệu mới trong tháng: ' + document[0].new_documents_this_month);

        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  function loadDataStatisticYear(){
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/StatisticsForYear`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          
          const user = response.user;
          const post = response.post;
          const document = response.document;
          $('#total-user').empty();
          $('#statistic-user').empty();
          $('#total-post').empty();
          $('#statistic-post').empty();
          $('#total-document').empty();
          $('#statistic-document').empty();
          $('#total-user').append('Tổng số người dùng: ' + user[0].total_users);
          $('#statistic-user').append('Số người dùng mới trong năm: ' + user[0].new_users_this_year);

          $('#total-post').append('Tổng số bài viết: ' + post[0].total_posts);
          $('#statistic-post').append('Số bài viết mới trong năm: ' + post[0].new_posts_this_year);

          $('#total-document').append('Tổng số tài liệu: ' + document[0].total_documents);
          $('#statistic-document').append('Số tài liệu mới trong năm: ' + document[0].new_documents_this_year);

        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  function loadTopUser(){
    $.ajax({
        type: "GET",
        url: `http://localhost:8001/api/v1/admin/topUser`,
        headers: {
            "Content-Type": "application/json"
        },
        
        success: function (response) {
          console.log(response.user_post);
          let $str = response.user_post.map(function (user) {
                    return `<li class="d-flex m-3">
                              <div class="avatar flex-shrink-0 me-3">
                                <img src="/img/${user.avatar_url}" alt="User" class="rounded">
                              </div>
                              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                  <h6 class="mb-0">${user.user_name}</h6>
                                </div>
                                <div class="user-progress d-flex align-items-center gap-1">
                                  <span class="text-muted">Số bài viết</span>
                                  <h6 class="mb-0">${user.post_count}</h6>
                                 
                                </div>
                              </div>
                            </li>
                            <hr class="m-0">
                            `; 
                })
                $('#list-post').html($str);
                let $str1 = response.user_document.map(function (user) {
                    return `<li class="d-flex m-3">
                              <div class="avatar flex-shrink-0 me-3">
                                <img src="/img/${user.avatar_url}" alt="User" class="rounded">
                              </div>
                              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                <div class="me-2">
                                  <h6 class="mb-0">${user.user_name}</h6>
                                </div>
                                <div class="user-progress d-flex align-items-center gap-1">
                                  <span class="text-muted">Số tài liệu</span>
                                  <h6 class="mb-0">${user.document_count}</h6>
                                 
                                </div>
                              </div>
                            </li>
                            <hr class="m-0">
                            `; 
                })
                $('#list-document').html($str1);
          
        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  loadTopUser();
  document.getElementById("defaultSelect").addEventListener("change", function() {
    var selectedOption = this.value;
    console.log("Option " + selectedOption + " is selected.");
    if(selectedOption == 1){
      loadDataStatisticDay();
    }
    if(selectedOption == 2){
      loadDataStatisticMonth();
    }
    if(selectedOption ==3){
      loadDataStatisticYear();
    }
    
  
  
 

});
  loadDataFromstatisticsByTag();
  loadDataFromstatisticsByTypes();
  loadDataStatisticDay();

  function loadDatastatisticsPostByMonth(year){
    
    $.ajax({
        type: "POST",
        url: `http://localhost:8001/api/v1/admin/post-by-month`,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            year: year
        }),
        
        success: function (response) {
          
          const data = response.post;
          console.log(data);
          // Mảng lưu trữ tổng số bài viết của mỗi nhóm
          const month = [];
          const post_count = [];

          // Lặp qua mỗi đối tượng trong dữ liệu API
          response.post.forEach(item => {
            month.push(item.month);
              post_count.push(parseInt(item.post_count)); // Chuyển đổi sang số nguyên
          });
          new Chart("mychartpost", {
            type: "line",
            data: {
            
              labels: month,
              datasets: [{
                label: 'Bài viết',
                data: post_count,
                borderColor: "red",
                fill: false
              
              }]
            },
            options: {
              legend: {display: false}
            }
          });
         

        },
        error: function (error) {
            console.log(error);
           
        },
    });
    

    
  }
  loadDatastatisticsPostByMonth(2024);
  function loadDatastatisticsDocumentByMonth(year){
    
    $.ajax({
        type: "POST",
        url: `http://localhost:8001/api/v1/admin/document-by-month`,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            year: year
        }),
        
        success: function (response) {
          
          const data = response.post;
          console.log(data);
          // Mảng lưu trữ tổng số bài viết của mỗi nhóm
          const month = [];
          const document_count = [];

          // Lặp qua mỗi đối tượng trong dữ liệu API
          response.post.forEach(item => {
            month.push(item.month);
            document_count.push(parseInt(item.document_count)); // Chuyển đổi sang số nguyên
          });
          new Chart("mychartdocument", {
            type: "line",
            data: {
            
              labels: month,
              datasets: [{
                label: 'Tài liệu',
                data: document_count,
                borderColor: "red",
                fill: false
              
              }]
            },
            options: {
              legend: {display: false}
            }
          });
         

        },
        error: function (error) {
            console.log(error);
           
        },
    });
    

    
  }
  loadDatastatisticsDocumentByMonth(2024);
  document.getElementById("defaultSelect1").addEventListener("change", function() {
    const div = document.getElementById('char');
    const div_document = document.getElementById('chardocument');
    
    var selectedOption = this.value;
    console.log("Option " + selectedOption + " is selected.");
    div.innerHTML = '';
    div_document.innerHTML = '';
    const newCanvas = document.createElement('canvas');
    const newCanvasDocuemnt = document.createElement('canvas');
    newCanvas.id = "mychartpost";
    newCanvasDocuemnt.id = "mychartdocument";
    div.appendChild(newCanvas);
    div_document.appendChild(newCanvasDocuemnt);
    loadDatastatisticsPostByMonth(selectedOption);
    loadDatastatisticsDocumentByMonth(selectedOption);
  
  
 

});