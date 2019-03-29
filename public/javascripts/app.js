/**
 * called by the HTML onload
 * initialise service worker TODO show any cached events
 */
function initServiceWorker() {
    //loadData();
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
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
        getCachedEvents();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

function sendAjaxQuery(url, data, next) {
    var store;
    if (url.indexOf('/post_story') > -1){
        store = 'store_user_stories';
    }
    else {
        store = 'store_events';
    }
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            storeCachedData(dataR, store);
            window.location.href = next;
            // in order to have the object printed by alert
            // we need to JSON stringify the object
            //document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
            //TODO
            //getCachedData(store);
        }
    });
}

function onSubmit(url, next) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery(url, data, next);
    event.preventDefault();
}

function addToEvents(dataR) {
    if (document.getElementById('events') != null) {
        const row = document.createElement('div');
        // appending a new row
        var button = document.getElementById('next_button')
        document.getElementById('events').insertBefore(row, button);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<a href='/events/"+ dataR.id +"'>" +
            "<h2 class='post-title'>" + getEventname(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getEventdescription(dataR) + "</h3></a>" +
            "<p class='post-meta'>Date: " + getEventdate(dataR) + "</p>";
    }
}

function addToStories(dataR) {
    if (document.getElementById('stories') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('stories').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        //TODO include Photo
        row.innerHTML = "<a href=''>" +
            "<h2 class='post-title'>" + getEvent(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getStory(dataR) + "</h3></a>" +
            "<p class='post-meta'>Posted by " + getUsername(dataR) + " on " +
            getDate(dataR) + ", " + getTime(dataR) + "</p>";
    }
}


function loadEventData(id){
    console.log(id);
    getEventById(id, function(dataR){
        console.log('doing');
        document.getElementById('title').innerHTML = dataR.name;
        document.getElementById('subheading').innerHTML = dataR.description;
        document.getElementById('date').innerHTML = dataR.date;
        getCachedStories(dataR.name);
    })
}

/////// Map Functionality //////
var latLong = [51.505, -0.09];
var mymap;
var marker;
function showMap(){
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
        generateMap();
    }
    document.getElementById('mapSection').style.display='block';
}

function showPosition(position){
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.latitude);
    latLong = [position.coords.latitude, position.coords.latitude];
    generateMap();
}

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
            break; }}

function onMapClick(e) {
    if (confirm("Is this the location you would like to add?")) {
        document.getElementById('latitude').value = e.latlng.lat;
        document.getElementById('longitude').value = e.latlng.lng;
        if (marker != null)
            marker.remove();
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    }
}

function generateMap(){
    var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaW5pZ2VuYTEiLCJhIjoiY2p0c2tyN2Q0MHEwazQ0cW5nYXdweTY0YSJ9.OsacubTngg18fAn4BBx0ig'
    });
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiaW5pZ2VuYTEiLCJhIjoiY2p0c2tyN2Q0MHEwazQ0cW5nYXdweTY0YSJ9.OsacubTngg18fAn4BBx0ig'
    });

    mymap = L.map('mapid',{
        center: latLong,
        zoom: 13,
        layers: [satellite, streets]
    });

    var baseMaps = {
        "Satellite": satellite,
        "Streets": streets
    };

    L.control.layers(baseMaps).addTo(mymap);
    L.control.scale().addTo(mymap);
    mymap.on('click', onMapClick);
}