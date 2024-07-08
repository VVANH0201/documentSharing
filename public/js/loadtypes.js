function loadtypes(){
    
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/types",
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            if (response.data != null) {
                let $str = response.data.map(function (types) {
                    return `<li><a class="dropdown-item" href="/types/${types.id}">${types.name}</a></li> `; 
                })
                $('#list-types').html($str);
            }
        },
        error: function (error) {
            console.log(error);
        },

    });

}
function loadtags(){
    
    $.ajax({
        type: "GET",
        url: "http://localhost:8001/api/v1/tags",
        
        success: function (response) {
            // Kiểm tra xem dữ liệu phản hồi có phải là null không
            if (response.data != null) {
                let $str = response.data.map(function (types) {
                    return `<a href = "/tag/${types.id}" class="btn btn-sm btn-outline-dark m-2"> ${types.name_tag}</a> `; 
                })
                $('#list_tags').html($str);
            }
        },
        error: function (error) {
            console.log(error);
        },

    });

}
loadtypes();
loadtags();

        
    