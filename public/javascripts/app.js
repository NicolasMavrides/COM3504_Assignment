/**
 * Called by the HTML onload
 * initialise service worker
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }
    // Check for support and load data
    if ('indexedDB' in window) {
        initDatabase();
        getEvents();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

///////////////////////// INTERFACE MANAGEMENT ////////////

/**
 * For a given Event, it will retrieve all the relevant information
 * @param id the identifier for the event in the database
 * @param dataR the data returned
 * class EventsObject{
 *   constructor (name, date, description, latitude, longitude) {
 *     this.name = name;
 *     this.date = date;
 *     this.description = description;
 *     this.latitude = latitude;
 *     this.longitude = longitude
 *   }
 *}
 */
function loadEventData(id){
    getEventById(id, function(dataR){
        console.log('doing');
        document.getElementById('title').innerHTML = getEventname(dataR);
        document.getElementById('subheading').innerHTML = getEventdescription(dataR);
        document.getElementById('date').innerHTML = getEventdate(dataR);
        getStories(dataR.name);
        getComments(id);
        // Add event location marker with a popup to the map
        var marker = [getLatitude(dataR), getLongitude(dataR)];
        generateMap(marker, marker, getEventname(dataR));
    })
}

/**
 * TODO:
 *}
 */
function loadEventList(dataR){
    console.log(dataR);
    let eventList = document.getElementById('eventList');
    if (eventList) {
        dataR.forEach(data =>{
            eventList.innerHTML += "<option>" + data.name+ "</option>";
        });
        $('#eventList').selectpicker('render');
    }
}

/**
 * Given the event data returned by the server,
 * it adds a row of events to the 'events' div
 * @param dataR the data returned by the server:
 * class EventsObject{
 *   constructor (name, date, description, latitude, longitude) {
 *     this.name = name;
 *     this.date = date;
 *     this.description = description;
 *     this.latitude = latitude;
 *     this.longitude = longitude
 *   }
 *}
 */
function addToEvents(dataR) {
    if (document.getElementById('events') != null) {
        const row = document.createElement('div');
        // adding a new row before the button
        var button = document.getElementById('next_button')
        document.getElementById('events').insertBefore(row, button);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        row.innerHTML = "<a href='/events/"+ getID(dataR) +"'>" +
            "<h2 class='post-title'>" + getEventname(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getEventdescription(dataR) + "</h3></a>" +
            "<p class='post-meta'>Date: " + getEventdate(dataR) + "</p>";
    }
}

/**
 * TODO:
 *}
 */
function addToResults(dataR) {
    document.getElementById('xForm').style.display='none';
    let row = document.createElement('div');
    row.innerHTML = "<div id='back_button' class='clearfix'>" +
        "<a class='btn btn-primary float-right' onclick='hideResults()'>← Back to search</a>" +
    "</div>";
    document.getElementById('results').appendChild(row);
    dataR.forEach(function(data, i){
        row = document.createElement('div');
        // adding a new row before the button
        document.getElementById('results').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        row.innerHTML = "<a href='/events/"+ getID(data) +"'>" +
            "<h2 class='post-title'>" + getEventname(data) + "</h2>" +
            "<h3 class='post-subtitle'>" + getEventdescription(data) + "</h3></a>" +
            "<p class='post-meta'>Date: " + getEventdate(data) + "</p>";
        if (i == dataR.length -1){
            document.getElementById('results').style.display='block';
        }
    });
}

/**
 * TODO:
 *}
 */
function hideResults(){
    document.getElementById('results').style.display='none';
    //Clear results
    document.getElementById('results').innerHTML = "";
    document.getElementById("xForm").reset();
    document.getElementById("xForm").style.display='block';
}

/**
 * Given the user story data returned by the server,
 * it adds a story to a row in the 'stories' div
 * @param dataR the data returned by the server:
 * class StoryObject{
 *   constructor (event, user, date, time, story, photo) {
 *     this.event = event;
 *     this.user = user;
 *     this.date = date;
 *     this.time = time;
 *     this.story = story;
 *     this.photo = photo;
 *   }
 *}
 */
function addToStories(dataR) {
    if (document.getElementById('stories') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('stories').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        row.innerHTML = "<a href=''>" +
            "<h2 class='post-title'>" + getEvent(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getStory(dataR) + "</h3></a>" +
            "<p class='post-meta'>Posted by " + getUsername(dataR) + " on " +
            getDate(dataR) + ", " + getTime(dataR) + "<img src="+ getPhoto(dataR) + ">";
    }
}

/**
 * TODO:
 *}
 */
function addToComments(dataR){
    if (document.getElementById('comments') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('comments').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('media');
        row.classList.add('mb-4');
        const newDiv = document.createElement('div');
        row.append(newDiv);
        newDiv.classList.add('media-body');
        newDiv.innerHTML = "<h5 class='mt-0'>" + getUsername(dataR) +
            "</h5>" + getComment(dataR);
    }
}
////////////////// FORM FUNCTIONS //////////////////
/**
 * Given a new event or story, it sends the data to the server via Ajax
 * if the request to the server fails, it shows an error message
 * @param url to send the request to
 * @param data to send to the server
 * @param next the page to redirect to on successful POST
 */
function sendAjaxQuery(url, data, next) {
    var store;
    if (url.indexOf('/post_story') > -1){
        store = 'store_user_stories';
    }
    else if ((url.indexOf('/post_event') > -1)) {
        store = 'store_events';
    }
    else {
        store = 'store_comments';
    }
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR, res) {
            if (url.indexOf('/search_event') > -1){
                addToResults(dataR);
                //TODO:
                getCachedSearcedEvents();
            }
            else {
                storeCachedData(dataR, store);
                window.location = next;
            }
        },
        error: function (xhr, status, error) {
            if (url.indexOf('/search_event')){
                getCachedSearcedEvents(data);
            }
            console.log('Error: ' + error.message);
        }
    });
}

/**
 * Serialises submitted form data
 * @param url to POST the data to
 * @param next the page to redirect to on successful POST
 */
function onSubmit(url, next) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    let send = true;
    if (url.indexOf('/post_story') > -1) {
        send = checkForPhoto(data);
    }
    else if (url.indexOf('/post_event') > -1) {
        send = checkForLatLong(data);
    }

    if (send) {
        sendAjaxQuery(url, data, next);
    }
    event.preventDefault();
}

/**
 * TODO:
 *}
 */
// Form validations
function checkForLatLong(data){
    if (data.latitude == "" || data.longitude ==""){
        document.getElementById("locationAlert").style.display = "block";
        return false;
    }
    return true;
}

function checkForPhoto(data){
    console.log(!data.image);
    console.log(data.image == "");
    if (!data.image) {
        document.getElementById("imageAlert").style.display = "block";
        return false;
    }
    return true;
}


////////////////// MAP FUNCTIONS //////////////////
//Default map location
var latLong = [51.505, -0.09];
var mymap;
var marker;

/**
 * Function to reveal the hidden Map
 * Gets the geo-location of the user
 */
function showMap(){
    //Check for support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        //Generates map with default map center
        console.log("Geolocation is not supported by this browser.");
        generateMap(null, latLong, null);
        mymap.on('click', onMapClick);
    }
    document.getElementById('mapSection').style.display='block';
}

/**
 * Callback function for successful geolocation
 * Sets the maps position to center on the user's location
 * @param position the latitude and longitude of the users' position
 */
function showPosition(position){
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.latitude);
    latLong = [position.coords.latitude, position.coords.latitude];
    //Generates map with center as users' location
    generateMap(null, latLong, null);
    mymap.on('click', onMapClick);
}

/**
 * Callback function for failed geolocation
 * @param error
 */
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}


/**
 * Generates a Leaflet map using Mapbox Tile Layers
 * @param marker latitude and longitude for a map marker
 * @param center the latitude and longitude to center the map on
 * @param eventName name of the event to add to a marker popup
 */
function generateMap(marker, center, eventName){
    const mapBoxKey = 'pk.eyJ1IjoiaW5pZ2VuYTEiLCJhIjoiY2p0c2tyN2Q0MHEwazQ0cW5nYXdweTY0YSJ9.OsacubTngg18fAn4BBx0ig';
    // Mapbox Streets tile layer
    var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: mapBoxKey
    });
    // Mapbox Satellite tile layer
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: mapBoxKey
    });

    // Initialize the map
    mymap = L.map('mapid',{
        center: center,
        zoom: 13,
        layers: [satellite, streets]
    });

    // Object for map base layers
    var baseMaps = {
        "Satellite": satellite,
        "Streets": streets
    };

    // Add Layers Control to the map
    // Ability to switch between each map layer
    L.control.layers(baseMaps).addTo(mymap);

    // Add a scale to the map (m/km and miles/ft)
    L.control.scale().addTo(mymap);

    // Add a marker to the map
    if (marker!=null) {
        L.marker(marker).addTo(mymap).bindPopup('<b>'+eventName+'</b>');
    }
}

function onMapClick(e) {
    if (confirm("Is this the location you would like to add?")) {
        document.getElementById('latitude').value = e.latlng.lat;
        document.getElementById('longitude').value = e.latlng.lng;
        // Removes any old markers
        if (marker != null)
            marker.remove();
        // Adds a new marker to the map
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    }
}