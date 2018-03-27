$('#log').on('click', function (e) {
    // e.preventDefault()
    $.ajax({
        type: "post",
        url: "/logincred",
        dataType: 'json',
        data: JSON.stringify({
            ux: $('#uname').val(),
            uy: $('#pwd').val(),
        }),
        contentType: 'application/json',
        success: function (data) {
            alert(data);
        }
    });
});

var name = $('#name').val()
var data = '{"name": name,}';