mymap.on('click', onMapClick);

function onMapClick(e) {
    if (confirm("Is this the location you would like to add?")) {
        document.getElementById('latitude').value = e.latlng.lat;
        document.getElementById('longitude').value = e.latlng.lng;
        if (marker != null)
            marker.remove();
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    }
}