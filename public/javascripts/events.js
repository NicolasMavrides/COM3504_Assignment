///////////////////////// INTERFACE MANAGEMENT ////////////

/**
 * For a given Event, it will retrieve all the relevant information
 * @param dataR - the data returned by the server:
 * Event Schema {
 *     name,
 *     date,
 *     description,
 *     latitude,
 *     longitude
 *   }
 */
function loadEventData(dataR){
    document.getElementById('title').innerHTML = getEventname(dataR);
    document.getElementById('subheading').innerHTML = getEventdescription(dataR);
    document.getElementById('date').innerHTML = getEventdate(dataR);
    getStories(getEventname(dataR));
    getComments(getID(dataR));
    // Add event location marker with a popup to the map
    var marker = [getLatitude(dataR), getLongitude(dataR)];
    generateMap(marker, marker, getEventname(dataR), false, defaultZoom);
}

/**
 * Given the event data returned by the server,
 * it adds a row of events to the 'events' div
 * @param dataR - the data returned by the server:
 * Event Schema {
 *     name,
 *     date,
 *     description,
 *     latitude,
 *     longitude
 *   }
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
 * Given the user story data returned by the server,
 * it adds a story to a row in the 'stories' div
 * @param dataR - the data returned by the server:
 * Story Schema {
 *     event,
 *     story,
 *     user,
 *     date,
 *     time,
 *     photo
 *   }
 */
function addToStories(dataR) {
    if (document.getElementById('stories') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('stories').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('post-preview');
        row.classList.add('media');
        row.classList.add('mb-4');
        row.innerHTML = "<img class='d-flex mr-3' src="+ getPhoto(dataR) + " alt=''>";
        const newDiv = document.createElement('div');
        row.append(newDiv);
        newDiv.classList.add('media-body');
        newDiv.innerHTML = "<a href=''>" +
            "<h2 class='post-title'>" + getEvent(dataR) + "</h2>" +
            "<h3 class='post-subtitle'>" + getStory(dataR) + "</h3></a>" +
            "<p class='post-meta'>Posted by " + getUsername(dataR) + " on " +
            getDate(dataR) + ", " + getTime(dataR) + "</p>";
    }
}

/**
 * Given the comments data returned by the server,
 * it adds a comment to a row in the 'comments' div
 * @param dataR - the data returned by the server:
 * Comment Schema {
 *     event,
 *     user,
 *     comment,
 *     date
 *   }
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