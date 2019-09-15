const distances = {};
const homeComp = new Set([]);

const qualityMap = {
    "Best Buy": "Electronics",
    "airport": "Airport",
    "bar": "Bar",
    "bus station": "Bus",
    "cafe": "Cafe",
    "clothing store": "Clothes",
    "daycare": "Daycare",
    "elementary school": "Elementary School",
    "groceries": "Groceries",
    "gym": "Gym",
    "high school": "High School",
    "library": "Library",
    "local fire station": "Fire Station",
    "local hospital": "Hospital",
    "local police station": "Police Station",
    "middle school": "Middle School",
    "movie theater": "Movie Theater",
    "park": "Park",
    "restaurant": "Resteraunt",
    "trails": "Trails",
    "train": "Train"
};


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
            drawChart();
        });
    });
}

function toggle(id) {
    if (id.style.display === "none") {
        id.style.display = "block";
    } else {
        id.style.display = "none";
    }
}

let swapGraphButtons = document.getElementsByClassName("swap-graph");
for (let i = 0; i < swapGraphButtons.length; ++i) {
    swapGraphButtons[i].addEventListener("click", () => {
        let parent = swapGraphButtons[i].parentNode.parentNode;
        let chart = parent.getElementsByClassName("chart")[0];
        let table = parent.getElementsByClassName("centerstuff")[0].getElementsByClassName("table")[0];

        toggle(chart);
        toggle(table);
        drawChart();
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
    notify("Collecting data");

    addAddressChip(address);


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

function updateHomeComp() {
    let box = document.getElementById("declarebox1");
    let box2 = document.getElementById("declarebox2");

    for (let i = 0; i < box2.getElementsByTagName("div").length; i += 1) {
        let child = box2.getElementsByTagName("div")[i];
        console.log(child);
        let textNode = child.childNodes[0].childNodes[0];
        homeComp.delete(textNode.textContent);
    }

    for (let i = 0; i < box.getElementsByTagName("div").length; i += 1) {
        let child = box.getElementsByTagName("div")[i];
        console.log(child);
        let textNode = child.childNodes[0].childNodes[0];
        if (distances[textNode.textContent] === undefined || distances[textNode.textContent] === null) {
            continue;
        }
        homeComp.add(textNode.textContent);
    }

    console.log(homeComp);
}

let numChips = 0;
function addAddressChip(address) {
    numChips += 1;

    let box = document.getElementById("declarebox1");
    let box2 = document.getElementById("declarebox2");

    box.onchange = () => {
        updateHomeComp();
        drawChart();
    };

    box2.onchange = () => {
        updateHomeComp();
        drawChart();
    };
    console.log(box);
    let div = document.createElement("div");
    box.appendChild(div);
    div.className = "declareitem";
    div.innerHTML = "<span class=\"mdl-chip decarechip1\"><span class=\"mdl-chip__text\">" + address + "</span><button id=\"specialtmp\"type=\"button\" class=\"mdl-chip__action\"><i class=\"material-icons\">cancel</i></button></span>";
    let btn = document.getElementById("specialtmp");
    btn.removeAttribute("id");
    btn.addEventListener("click", () => {
        console.log(btn.parentNode);
        btn.parentNode.parentNode.removeChild(btn.parentNode);
        homeComp.delete(address);
        numChips -= 1;
        drawChart();
    });
}

$("#chatMessage").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#sendmessagebutton").click();
    }
});

$('#addresssubmit').click(function (e) {
    document.getElementById("content").style.display = "block";
    document.getElementById("declareformparent").style.display = "block";
    e.preventDefault();

    const address = document.getElementById("addressboxvalue").value;
    updateAll(address);

    return false;
});


google.charts.load('current', { 'packages': ['bar'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    console.log("drawing chart...");
    if (homeComp.size == 0) {
        console.log(homeComp.size);
        document.getElementById("content").style.display = "none";
        if (numChips == 0) {
            document.getElementById("declareformparent").style.display = "none";
        }
        return;
    }

    document.getElementById("content").style.display = "block";
    document.getElementById("declareformparent").style.display = "block";

    const graphs = ["safety", "education", "shopping", "lifestyle", "food", "transportation", "nature"];
    const qualities2 = [["local police station", "local fire station", "local hospital"], ["elementary school", "middle school", "high school", "daycare"], ["clothing store", "Best Buy", "groceries"], ["movie theater", "gym", "library"], ["restaurant", "bar", "cafe"], ["airport", "train", "bus station"], ["park", "trails"]];

    for (let i = 0; i < graphs.length; ++i) {
        let graph = graphs[i];
        let qualities = qualities2[i];

        let data = [['Amenity']];
        homeComp.forEach((value) => {
            data[0].push(value);
        });

        for (let j = 0; j < qualities.length; ++j) {
            data.push([qualityMap[qualities[j]]]);

            homeComp.forEach((value) => {
                data[data.length - 1].push(distances[value][qualities[j]]);
            });
        }

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

    for (let i = 0; i < graphs.length; ++i) {
        let graph = graphs[i];
        let qualities = qualities2[i];

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Amenity (miles away)');
        homeComp.forEach((value) => {
            data.addColumn('number', value);
        });

        let datacomp = [];

        for (let i = 0; i < qualities.length; ++i) {
            let cur = [qualityMap[qualities[i]]];
            homeComp.forEach((value) => {
                cur.push(distances[value][qualities[i]]);
            });
            datacomp.push(cur);
        }

        data.addRows(datacomp);

        let graphDiv = document.getElementById(graph + "_graph");
        let table = graphDiv.getElementsByClassName("centerstuff")[0].getElementsByClassName("table")[0];
        table = new google.visualization.Table(table);
    
        table.draw(data, { showRowNumber: false, width: 'auto', height: 'auto', colors: ['#1b9e77', '#d95f02', '#7570b3'] });

    }

    drawTable();
}

google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(drawTable);

function drawTable() {
    const qualities = ["local police station", "local fire station", "local hospital", "elementary school", "middle school", "high school", "daycare", "clothing store", "Best Buy", "groceries", "movie theater", "gym", "library", "restaurant", "bar", "cafe", "airport", "train", "bus station", "park", "trails"];

    let data = new google.visualization.DataTable();
    if (homeComp.size == 0) {
        return;
    }

    data.addColumn('string', 'Amenity (miles away)');
    homeComp.forEach((value) => {
        data.addColumn('number', value);
    });

    let datacomp = [];
    for (let i = 0; i < qualities.length; ++i) {
        let cur = [qualityMap[qualities[i]]];
        homeComp.forEach((value) => {
            cur.push(distances[value][qualities[i]]);
        });
        datacomp.push(cur);
    }

    data.addRows(datacomp);

    const table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, { showRowNumber: false, width: 'auto', height: 'auto', colors: ['#1b9e77', '#d95f02', '#7570b3'] });
}