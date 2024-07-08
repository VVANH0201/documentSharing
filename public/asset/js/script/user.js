load();
  function load(){
    const buttonfollows = document.getElementById('buttonfollows');
    const following_user_id = document.getElementById('user_ing').value;
    const followed_user_id = document.getElementById('user_ed').value;
    var requests = {
        "url": `http://localhost:8001/api/v1/user/check`,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "following_user_id": following_user_id,
            "followed_user_id": followed_user_id,
            
        })
    }
    $.ajax(requests).done(function (response) {
        console.log(response.message);
        if(response.data){
          
          buttonfollows.textContent = "Hủy";
        }
        else{
          //buttonfollows.append("<i class='bx bx-plus'></i>")
          buttonfollows.textContent = "Theo dõi";
        }
        
    })
        .fail(function (errorThrown) {
            console.error("Lỗi: ", errorThrown);
           
        });
  }

  function hanldeFollowing(){
    const following_user_id = document.getElementById('user_ing').value;
    const followed_user_id = document.getElementById('user_ed').value;
    var requests = {
        "url": `http://localhost:8001/api/v1/user/check`,
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "following_user_id": following_user_id,
            "followed_user_id": followed_user_id,
            
        })
    }
    $.ajax(requests).done(function (response) {
        console.log(response.message);
        if(response.data){
          var requests = {
            "url": `http://localhost:8001/api/v1/user/unfollows`,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "following_user_id": following_user_id,
                "followed_user_id": followed_user_id,
            })
          }
          $.ajax(requests).done(function (response) {
            console.log(response.message);
            load();
            loadfollowed();
            loadfollowing();
          })
          .fail(function (errorThrown) {
            console.error("Lỗi: ", errorThrown);
          });
        }
        else{
          var requests = {
            "url": `http://localhost:8001/api/v1/user/follows`,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "following_user_id": following_user_id,
                "followed_user_id": followed_user_id,
            })
          }
          $.ajax(requests).done(function (response) {
            console.log(response.message);
            load();
            loadfollowed();
            loadfollowing();
          })
          .fail(function (errorThrown) {
            console.error("Lỗi: ", errorThrown);
          });
        }
        
    })
        .fail(function (errorThrown) {
            console.error("Lỗi: ", errorThrown);
           
        });
  
  }
  function loadfollowing(){
    const id = document.getElementById('user_ed').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/user/following/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            // 
            $('#following').empty();
            let num = response.num;
            $('#following').append(num);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  function loadfollowed(){
    const id = document.getElementById('user_ed').value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/user/followed/"+id,
        
        success: function (response) {
          $('#followed').empty();
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
function loadtype(id){
    //const list = document.getElementsByClassName("${id}")
     $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/post/tag/"+id,
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            let $str = response.data.map(function (type) {
                    return `
                    <a href = "/tag/${type.tag_id}" class="btn btn-xs btn-primary"> ${type.name_tag}</a>
                `;
                });
            
              $("#type" + id).html($str);
              //console.log(str);
        },
        error: function (error) {
            console.log(error);
        },

    });
  }
  loadfollowing();
  loadfollowed();
  function getData() {
    var inputs = document.getElementsByClassName('num');
    var inputValues = [];

    for (var i = 0; i < inputs.length; i++) {
        inputValues.push(inputs[i].value);
       loadtype(inputs[i].value);
    }
    console.log(inputValues);
    
    // Sử dụng mảng inputValues ở đây
}
getData();
  $(document).ready(function() {
  
  //loadtype(id); // Call loadtype after DOM is ready
});
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