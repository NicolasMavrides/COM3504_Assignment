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
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

////////////////// FORM FUNCTIONS //////////////////
/**
 * Given the event data returned by the server,
 * it adds the event names to the dropdown select on the story form
 * @param dataR - the data returned by the server:
 * Event Schema {
 *     name,
 *     date,
 *     description,
 *     latitude,
 *     longitude
 *   }
 *}
 */
function loadEventList(dataR){
    let eventList = document.getElementById('eventList');
    if (eventList) {
        dataR.forEach(data =>{
            eventList.innerHTML += "<option>" + data.name+ "</option>";
        });
        $('#eventList').selectpicker('render');
    }
}

/**
 * Given a new event or story, it sends the data to the server via Ajax
 * if the request to the server fails, it shows an error message
 * @param url to send the request to
 * @param data to send to the server
 * @param next - the page to redirect to on successful POST
 */
function sendAjaxQuery(url, data, next) {
    var store;

    // Change IndexDB Store
    if (url.indexOf('/post_story') > -1){
        store = 'store_user_stories';
    } else if ((url.indexOf('/post_event') > -1)) {
        store = 'store_events';
    } else {
        store = 'store_comments';
    }

    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            if (url.indexOf('/search_event') > -1){
                addToResults(dataR);
            } else if (url.indexOf('/search_map') > -1){
                let center = [data.latitude, data.longitude];
                document.getElementById("search-map").style.display = 'none';
                document.getElementById('mapSection').style.display = 'block';
                generateMap(dataR, center, null, true, 11);
            } else {
                //Add data to cache
                storeCachedData(dataR, store);
                window.location = next;
            }
        },
        error: function (xhr, status, error){
            console.log('Error: ' + error.message);
            // Searches for events in cache when offline
            if (url.indexOf('/search_event') > -1){
                console.log('Falling back to cache - searching');
                getCachedSearcedEvents(data);
            }
        }
    });
}

/**
 * Serialises submitted form data
 * @param url to POST the data to
 * @param next - the page to redirect to on successful POST
 */
function onSubmit(url, next) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }

    // Form validation methods
    let send = true;
    if (url.indexOf('/post_story') > -1) {
        send = checkForPhoto(data);
    }
    else if (url.indexOf('/post_event') > -1 || url.indexOf('/search_eventMap') > -1) {
        send = checkForLatLong(data);
    }

    if (send) {
        sendAjaxQuery(url, data, next);
    }
    event.preventDefault();
}

////////////////// FORM VALIDATION //////////////////

/**
 * Function to check that the latitude and longitude are present
 * @param data - data to validate
 */
function checkForLatLong(data){
    if (data.latitude == "" || data.longitude ==""){
        document.getElementById("locationAlert").style.display = "block";
        return false;
    }
    return true;
}

/**
 * Function to check that the a photo has been taken
 * @param data - data to validate
 */
function checkForPhoto(data){
    if (!data.image) {
        document.getElementById("imageAlert").style.display = "block";
        return false;
    }
    return true;
}