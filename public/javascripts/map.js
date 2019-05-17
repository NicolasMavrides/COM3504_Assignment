////////////////// MAP FUNCTIONS //////////////////

//Default map location
var latLong = [51.505, -0.09];
var mymap;
var marker;
const defaultZoom = 13;

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
        generateMap(null, latLong, null, false, defaultZoom);
        mymap.on('click', onMapClick);
    }
    document.getElementById('mapSection').style.display='block';
}

/**
 * Callback function for successful geolocation
 * Sets the maps position to center on the user's location
 * @param position - the latitude and longitude of the users' position
 */
function showPosition(position){
    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.latitude);
    latLong = [position.coords.latitude, position.coords.latitude];
    //Generates map with center as users' location
    generateMap(null, latLong, null, false, defaultZoom);
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
 * @param marker - latitude and longitude for a map marker or a list map markers
 * @param center - the latitude and longitude to center the map on
 * @param eventName - name of the event to add to a marker popup
 * @param multi - boolean to indicate if marker is a list or single marker location
 * @param zoom - the zoom level for the map
 */
function generateMap(marker, center, eventName, multi, zoom){
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
        zoom: zoom,
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

    // Adds a single or multiple markers to the map
    if (!multi && marker!=null) {
        L.marker(marker).addTo(mymap).bindPopup('<b>'+eventName+'</b>');
    } else if (multi){
        //Creates a circle with a radius of 5km
        L.circle(center, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: 5000
        }).addTo(mymap);
        //Add markers to the map
        marker.forEach(function(data) {
            let html = "<b><a href='/events/"+ getID(data) +"'>" + getEventname(data) +
                '</a></b><br>'+getEventdate(data);
            let location = [getLatitude(data), getLongitude(data)];
            L.marker(location).addTo(mymap).bindPopup(html);
        });
    }
}

/**
 * Function for interacting with the map
 */
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