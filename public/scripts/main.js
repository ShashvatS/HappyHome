//can have multiple document.ready calls
$(document).ready(() => {
    $('#mainform').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/proximity',
            type: 'post',
            data: $('#mainform').serialize(),
            success: response => {
                console.log("mainform submit response");
                console.log(response);
            }
        });

        return false;
    });

    $('#otherform').submit(function (e) {
        e.preventDefault();

        const form = document.getElementById("otherform");
        const addressField = form.getElementsByClassName("address")[0];
        const address = addressField.value;

        const qualitiesField = form.getElementsByClassName("qualities")[0];
        const qualities = qualitiesField.value.split(",");

        let q = [];

        for (let i = 0; i < qualities.length; i += 1) {
            q.push({
                start: address,
                item: qualities[i],
                mode: 'driving'
            });
        }

        const queries = {
            queries: q
        };

        console.log(queries);

        $.ajax({
            url: '/proximity_multiple',
            type: 'post',
            data: JSON.stringify(queries),
            contentType: "application/json",
            success: response => {
                console.log("other form submit response");
                console.log(response);
            }
        });

        return false;
    });
});
