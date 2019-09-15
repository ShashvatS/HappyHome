const distances = {};
const homeComp = new Set([]);

const qualityMap = {
    "Best Buy": "Electronics",
    "airport": "Airport",
    "bar": "Bar",
    "bus station": "Bus",
    "cafe": "Cafe",
    "clothing store": "CLothes",
    "daycare": "Daycare",
    "elementary school": "Elementary School",
    "groceries": "Groceries",
    "gym": "Gym",
    "high school": "High School",
    "library": "Library",
    "local fire station": "Fire Station",
    "local hospital": "Hospital",
    "local police station": "Police",
    "middle school": "Middle School",
    "movie theater": "Movie Theater",
    "park": "Park",
    "restaurant": "Resteraunt",
    "trails": "Trails",
    "train": "Train"
};

const hideAll = true;


let minimizeGraphButtons = document.getElementsByClassName("hide-graph");
for (let i = 0; i < minimizeGraphButtons.length; ++i) {
    minimizeGraphButtons[i].addEventListener("click", () => {
        let parent = minimizeGraphButtons[i].parentNode.parentNode;
        console.log(parent);
        parent.style.display = "none";

        let val = parent.getAttribute("data-graph");
        console.log(val);

        let btn = document.getElementById("redisplaybuttonarray").getElementsByTagName("button")[val];
        btn.style.display = "inline-block";

        btn.addEventListener("click", () => {
            let graph = btn.getAttribute("data-graph");
            document.getElementById(graph).style.display = "block";
            btn.style.display = "none";
        });
    });
}

function notify(msg) {
    const notification = document.querySelector('.mdl-js-snackbar');
    const notificationData = {
      message: msg
    };

    notification.MaterialSnackbar.showSnackbar(notificationData);
}

function updateAll(address) {
    const qualities = ["local police station", "local fire station", "local hospital", "elementary school", "middle school", "high school", "daycare", "clothing store", "Best Buy", "groceries", "movie theater", "gym", "library", "restaurant", "bar", "cafe", "airport", "train", "bus station", "park", "trails"];
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
    notify("Collecting data")

    $.ajax({
        url: '/proximity_multiple',
        type: 'post',
        data: JSON.stringify(queries),
        contentType: "application/json",
        success: response => {
            //actually do stuff here with response
            //parse response

            if (response === undefined) {
                return;
            }

            if (distances[address] === undefined) {
                distances[address] = {};
            }


            for (let i = 0; i < response.data.length; ++i) {
                if (response.data[i] == null) {
                    notify("There was an error probably caused by an invalid address");
                    console.log("error, invalid reponse probably because of invalid address");
                    return;
                }
                distances[address][qualities[i]] = response.data[i].rows[0].elements[0].distance.value / 1609.344;
            }

            console.log(response);

            homeComp.add(address);
            drawChart();
        }
    });
}

$('#addresssubmit').click(function (e) {
    document.getElementById("content").style.display = "block";
    e.preventDefault();

    const address = document.getElementById("addressboxvalue").value;
    updateAll(address);

    return false;
});


google.charts.load('current', { 'packages': ['bar'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    if (homeComp.size == 0) {
        console.log(homeComp.size);
        return;
    }

    const graphs = ["safety", "education", "shopping", "lifestyle", "food", "transportation", "nature"];
    const qualities2 = [["local police station", "local fire station", "local hospital"], ["elementary school", "middle school", "high school", "daycare"], ["clothing store", "Best Buy", "groceries"], ["movie theater", "gym", "library"], ["restaurant", "bar", "cafe"], ["airport", "train", "bus station"], ["park", "trails"]];

    for (let i = 0; i < graphs.length; ++i) {
        let graph = graphs[i];
        let qualities = qualities2[i];

        let data = [['Amenity']];
        homeComp.forEach((value) => {
            console.log("homecomp", value);
            data[0].push(value);
        });

        for (let j = 0; j < qualities.length; ++j) {
            data.push([qualityMap[qualities[j]]]);

            homeComp.forEach((value) => {
                console.log(distances);
                data[data.length - 1].push(distances[value][qualities[j]]);
            });
        }

        console.log(data);

        data = google.visualization.arrayToDataTable(data);

        let graphDiv = document.getElementById(graph + "_graph");
        let chart = graphDiv.getElementsByClassName("chart")[0];
        chart = new google.charts.Bar(chart);

        let options = {
            chart: {
                title: ' '
            },
            bars: 'vertical',
            vAxis: { title: 'Distance (miles)', format: 'decimal' },
            height: 300,
            colors: ['#1b9e77', '#d95f02', '#7570b3']
        };


        chart.draw(data, google.charts.Bar.convertOptions(options));
    }

}