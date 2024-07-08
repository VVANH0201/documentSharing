function handlechange(){
    $("#change").on("click", function(event) {
        event.preventDefault();
        const buttonChange = document.querySelector('#change'),
              buttonSave = document.querySelector('#save'),
              inputName = document.querySelector('#fullnanme'),
              inputusername = document.querySelector('#username'),
              inputaddress = document.querySelector('#address'),
              inputphone = document.querySelector('#phone_number');
        inputName.disabled  = false;
        inputusername.disabled  = false;
        inputName.disabled  = false;
        inputaddress.disabled  = false;
        inputphone.disabled  = false;
        inputName.focus();      
        buttonSave.hidden = false;
        buttonChange.hidden = true;
    });
}
function handleView(id){
  $.ajax({
    url: `http://localhost:8001/api/v1/document/updateview`,
    method: "POST",
    dataType: "json",
    data: {id: id},
    success: function(data) {
      alert(data.message);
                      
    },
    error: function(err) {
      alert(err.responseText);
    }
  });
  //alert(id);
}
function handleDownload(id){
  $.ajax({
    url: `http://localhost:8001/api/v1/document/updatedownloadview`,
    method: "POST",
    dataType: "json",
    data: {id: id},
    success: function(data) {
      alert(data.message);
                      
    },
    error: function(err) {
      alert(err.responseText);
    }
  });
  //alert(id);
}
// function handlesave(){
//     $("#save").on("click", function(event) {
//         event.preventDefault();
//         const buttonChange = document.querySelector('#change'),
//               buttonSave = document.querySelector('#save'),
//               inputName = document.querySelector('#fullnanme');
//         inputName.disabled  = true;      
//         buttonSave.hidden = true;
//         buttonChange.hidden = false;
//     });
// }
$(document).ready(function() {
  handlechange();
  //handlesave();
});
function changeDate(dateString){
  var date = new Date(dateString);

  // Lấy ngày, tháng, năm từ đối tượng Date
  var day = date.getDate();
  var month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
  var year = date.getFullYear();

  // Tạo chuỗi ngày tháng năm
  var formattedDate = day + "/" + month + "/" + year;
  return formattedDate;
}

function loadfollowing(){
    const id = document.getElementById('user_id1').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/user/following/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            // 
            let num = response.num;
            $('#following').append(num);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  function loadfollowed(){
    const id = document.getElementById('user_id1').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/user/followed/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            // 
            let num = response.num;
            $('#followed').append(num);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  function loadNumberOfPost(){
    const id = document.getElementById('user_id1').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/post/get-by-user/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            // 
            let num = response.data;
            $('#postnum').append(num);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  function loadNumberOfDocument(){
    const id = document.getElementById('user_id1').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/document/get-by-user/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            // 
            let num = response.data;
            $('#documentnum').append(num);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  loadfollowing();
  loadfollowed();
  loadNumberOfDocument();
  loadNumberOfPost();
  function loadDataFromstatisticsByTypes(){
    const id = document.getElementById('user_id1').value;
    $.ajax({
        type: "POST",
        url: `http://localhost:8001/api/v1/types/statistic-by-user` ,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
          id: id,
        }),
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
                text: "Thống kê tài liệu đăng theo danh mục"
              }
            }
          });

           
        },
        error: function (error) {
            console.log(error);
           
        },
    });
  }
  loadDataFromstatisticsByTypes();