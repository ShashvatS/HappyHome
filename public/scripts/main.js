//can have multiple document.ready calls
$(document).ready(() => {
    $('#mainform').submit(function (e) {
        e.preventDefault();
        console.log($('#mainform').serialize());
        $.ajax({
            url: '/test',
            type: 'post',
            data: $('#mainform').serialize(),
            success: response => {
                console.log("mainform submit response");
                console.log(response);
            }
        })

        return false;
    });

    $('#otherform').submit(function (e) {
        e.preventDefault();
        console.log($('#mainform').serialize());

        const data = { "hello": "world" };
        $.ajax({
            url: '/test',
            type: 'post',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: response => {
                console.log("mainform submit response");
                console.log(response);
            }
        })

        return false;
    });
})

