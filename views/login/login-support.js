$('.submit').on('click', function(e){
    e.preventDefault()
    $.ajax({
        url: '/login',
        type: 'post',
        dataType: 'json',
        data:{
            ux: $('#uname').val(),
            uy: $('#pwd').val(),
        },
        success: function(data){
            alert(data);
        }
    });
});