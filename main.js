

// sets a callback function over the whole code
// cb is the function that will be passed to the function below
function getData(url, cb) {
    // declaring variable which contains an XMLHttpRequest object
    // XML similar to HTML
    var xhr = new XMLHttpRequest();

    // .open method on XMLHttpRequest object
    // GET retrieves data from the server
    // 2nd argument is the URL we want to 'get' (declared above) + the rest of the URL as string concat.
    xhr.open("GET", url);
    // Sends the request to the server
    xhr.send();

    // The function that is called
    // Ready state of 4 = operation has been completed
    // HTTP Status code of 200 means that the request is received and content delivered (same category as 404)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // this is the function that is passed in to the function at the bottom
            // this is putting a function within a function
            // doesn't get called until the above conditions are met
            cb(JSON.parse(this.responseText));
        };
    };
};

// the getData function is being called which returns a function (cb) which contains the argument that contains the response text
// the cb function is then passed in to another function - which is the nameless function - with a parameter of 'data'
// the console logs 'data' or the result of the cb function
// the result of this is that the console doesn't log the data until after the website has loaded
// it also keeps all this code out of the if statement above - keeping it neat
/*
getData(function(data) {
    console.log(data);
});
*/

function getTableHeaders(obj) {
    var tableHeaders = [];
    Object.keys(obj).forEach(function (key) {
        tableHeaders.push(`<td>${key}</td>`);
    });
    return `<tr>${tableHeaders}</tr>`
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

// type is the type of data from the API - in this case 'people' 'starships' etc
// the type is sent from the button to the setData function, added to the URL and 
function writeToDocument(url) {
    var tableRows = [];
    var el = document.getElementById("data");
    el.innerHTML = "";

    getData(url, function (data) {

        if (data.next || data.previous) {
            var pagination;
            pagination = generatePaginationButtons(data.next, data.previous)
        }
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);

        data.forEach(function (item) {
            var dataRow = [];
            Object.keys(item).forEach(function (key) {
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`);
        });
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");
    });
};