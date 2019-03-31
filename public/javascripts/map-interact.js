// Add map click interaction
mymap.on('click', onMapClick);

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