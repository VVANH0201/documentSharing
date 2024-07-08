// function loadnoti(){
//     const user_id = document.getElementById("userid").value;
//     $.ajax({
//         type: "GET",
//         url: "http://localhost:8001/api/v1/notification/"+user_id,
        
//         success: function (response) {
//             // Kiểm tra xem dữ liệu phản hồi có phải là null không
//             if (response.data !== null) {
//                 let num = response.num;
//                 let $str = response.data.map(function (noti) {
//                     return `<li class ="dropdown-item">
//                     <div class="d-flex mb-2 ">
//                       <div class="flex-shrink-0 ">
//                         <img src="/img/${noti.avatar_url}" class="me-1" height="30">
//                       </div>
//                       <div class="flex-grow-1 row">
//                         <div class="col-md-8 mb-sm-0 d-flex">
//                           <a href = "${noti.link}" class="mb-0" onclick ="update_noti(${noti.id})">
//                              <p style="font-size: 12px;">${noti.content}</p>
//                           </a>
                         
//                         </div>
//                         <small style="font-size: 12px;" class="text-muted">${countTime(noti.created_at)}</small>
                        
//                       </div>
//                     </div>
//                   </li> 
//                   <hr class="m-0">
//                   `; 
//                 })
//                 $str += `<a href = "/noti">Xem tất cả</a>`; 
//                 $('#list_notification').html($str);
//                 $('#num_notification').html(num);
//             }
//             if(response.num ==0){
//                 $('#list_notification').html('<p>Không có thông báo mới</p>');
//             }
//             // else{
                
//             //     $('#list_notification').html('<p>No notifications found</p>');
//             // }
           
//         },
//         error: function (error) {
//             console.log(error);
//         },

//     });

// }
// function loadnotiAdmin(){
//   const user_id = document.getElementById("userid").value;
//   $.ajax({
//       type: "GET",
//       url: "http://localhost:8001/api/v1/noti/admin/"+user_id,
      
//       success: function (response) {
//           // Kiểm tra xem dữ liệu phản hồi có phải là null không
//           if (response.data !== null) {
//               let num = response.num;
//               let $str = response.data.map(function (noti) {
//                   return `<li class ="dropdown-item">
//                   <div class="d-flex mb-2 ">
                   
//                     <div class="flex-grow-1 row">
//                       <div class="col-md-8 mb-sm-0">
//                       <p style="font-size: 12px;">${noti.content}</p>
//                       <small style="font-size: 12px; margin-bottom:0px;" class="text-muted">${countTime(noti.created_at)}</small>
//                     </div>
//                   </div>
//                 </li> 
//                 <hr class="m-0">
//                 `; 
//               })
              
//               $('#list_notification_admin').html($str);
//               $('#num_notification_admin').html(num);
//           }
//           if(response.num ==0){
//               $('#list_notification').html('<p>Không có thông báo mới từ admin</p>');
//           }
//           // else{
              
//           //     $('#list_notification').html('<p>No notifications found</p>');
//           // }
         
//       },
//       error: function (error) {
//           console.log(error);
//       },

//   });

// }
// function update_noti(id){

//     $.ajax({
//         url: `http://localhost:8001/api/v1/notification/update`,
//         method: "POST",
//         dataType: "json",
//         data: {id: id},
//         success: function(data) {
//           //alert(data.message);
                          
//         },
//         error: function(err) {
//           alert(err.responseText);
//         }
//       });
// }
// function shortenTextByWords(text, maxWords) {
//   // Tách văn bản thành các từ dựa trên khoảng trắng
//   let words = text.split(/\s+/);
  
//   // Nếu số từ ít hơn hoặc bằng số từ tối đa, trả về văn bản gốc
//   if (words.length <= maxWords) {
//     return text;
//   }

//   // Lấy 50 từ đầu tiên và thêm dấu ba chấm
//   let shortenedText = words.slice(0, maxWords).join(' ') + '...';

//   return shortenedText;
// }
// function countTime(created_at_string) {
//   let created_at = new Date(created_at_string);
//   let now = new Date();

//   let timeDifference = now - created_at; // Khoảng thời gian ở dạng miligisecond

//   let minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Chuyển đổi sang phút
//   let hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Chuyển đổi sang giờ
//   let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Chuyển đổi sang ngày

//   let result;

//   if (daysDifference > 0) {
//       result = daysDifference + (daysDifference === 1 ? " ngày trước" : " ngày trước");
//   } else if (hoursDifference > 0) {
//       result = hoursDifference + (hoursDifference === 1 ? " giờ trước" : " giờ trước");
//   } else {
//       result = minutesDifference + (minutesDifference === 1 ? " phút trước" : " phút trước");
//   }

//   return result;
// }
// window.onload = function () {
//   let intervalId = setInterval(() => {
//     loadnoti();
//     loadnotiAdmin();
//   }, 1000);
// }
// //setTimeout(loadnoti, 1000);
// //loadnoti();