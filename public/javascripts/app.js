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
        getCachedData();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

function sendAjaxQuery(url, data, next) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            console.log(typeof dataR);
            storeCachedData(dataR);
            //window.location.href = next;
            // in order to have the object printed by alert
            // we need to JSON stringify the object
            //document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
            getCachedData();
        }
    });
}

function onSubmit(url, next) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    console.log(typeof data);
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery(url, data, next);
    event.preventDefault();
}

function addToResults(dataR) {
    console.log(dataR)
    if (document.getElementById('events') != null) {
        const row = document.createElement('div');
        // appending a new row
        var button = document.getElementById('next_button')
        document.getElementById('events').insertBefore(row, button);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<a href=''>" +
            "<h2 class='post-title'>" + getEvent(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getStory(dataR) + "</h3></a>" +
            "<p class='post-meta'>Posted by " + getUsername(dataR) + " on " +
            getDate(dataR) + ", " + getTime(dataR) + "</p>";
    }
}