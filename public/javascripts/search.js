////////////////// SEARCH PAGE FUNCTIONS //////////////////

/**
 * Given the searched events returned by the server,
 * it adds a row of events to the 'results' div
 * @param dataR the data returned by the server - list of events:
 * Event Schema {
 *     name,
 *     date,
 *     description,
 *     latitude,
 *     longitude
 *   }
 */
function addToResults(dataR) {
    document.getElementById('search-text').style.display='none';
    let row = document.createElement('div');
    row.innerHTML = "<div id='back_button' class='clearfix'>" +
        "<a class='btn btn-primary float-right' onclick='hideResults()'>← Back to search</a>" +
        "</div>";
    if (document.getElementById('results') != null) {
        document.getElementById('results').appendChild(row);
        dataR.forEach(function (data, i) {
            row = document.createElement('div');
            // adding a new row before the button
            document.getElementById('results').appendChild(row);
            // formatting the row by applying css classes
            row.classList.add('post-preview');
            row.innerHTML = "<a href='/events/" + getID(data) + "'>" +
                "<h2 class='post-title'>" + getEventname(data) + "</h2>" +
                "<h3 class='post-subtitle'>" + getEventdescription(data) + "</h3></a>" +
                "<p class='post-meta'>Date: " + getEventdate(data) + "</p>";
            if (i == dataR.length - 1) {
                document.getElementById('results').style.display = 'block';
            }
        });
    }
}

/**
 * Function to switch from text search to the map search
 */
function showMapSearch(){
    document.getElementById("search-text").style.display='none';
    document.getElementById('search-map').style.display='block';
}

/**
 * Function to switch from the map search to the text search
 */
function showNormalSearch(){
    document.getElementById("search-map").style.display='none';
    document.getElementById('search-text').style.display='block';
}

/**
 * Function to clear results and reset forms
 */
function hideResults(){
    document.getElementById('results').style.display='none';
    document.getElementById('mapSection').style.display='none';
    if (mymap) {
        mymap.remove();
    }
    //Clear results
    document.getElementById('results').innerHTML = "";
    document.getElementById("search-text").reset();
    document.getElementById('search-map').reset();
    showNormalSearch();
    document.getElementById("form-group").style.display='block';
}