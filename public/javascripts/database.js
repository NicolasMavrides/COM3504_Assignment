////////////////// DATABASE //////////////////
// the database receives from the server the following structures
/**
 *
 * Event Schema {
 *     name,
 *     date,
 *     description,
 *     latitude,
 *     longitude
 *   }
 *
 * Story Schema {
 *     event,
 *     story,
 *     user,
 *     date,
 *     time,
 *     photo
 *   }
 *
 * Comment Schema {
 *     event,
 *     user,
 *     comment,
 *     date
 *   }
 */

var dbPromise;

const APP_DB_NAME = 'db_pwa_1';
const STORIES_STORE_NAME = 'store_user_stories';
const EVENTS_STORE_NAME = 'store_events';
const COMMENTS_STORE_NAME = 'store_comments';

/**
 * it initializes the IndexDB database
 */
function initDatabase(){
    dbPromise = idb.openDb(APP_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORIES_STORE_NAME)) {
            var storiesDB = upgradeDb.createObjectStore(STORIES_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storiesDB.createIndex('event', 'event', {unique: false, multiEntry: true});
        }
        if (!upgradeDb.objectStoreNames.contains(EVENTS_STORE_NAME)) {
            var eventsDB = upgradeDb.createObjectStore(EVENTS_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventsDB.createIndex('name', 'name', {unique: false, multiEntry: true});
            eventsDB.createIndex('_id', '_id', {unique: true, multiEntry: false});
        }
        if (!upgradeDb.objectStoreNames.contains(COMMENTS_STORE_NAME)) {
            var commentsDB = upgradeDb.createObjectStore(COMMENTS_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            commentsDB.createIndex('event', 'event', {unique: false, multiEntry: true});
        }
    });
}

////////////////// CACHE -INDEXDB //////////////////
/**
 * Saves an object (event or user story) in localStorage
 * @param object - Story, Event or Comment
 * @param chosenStore - the store name to save the object to
 */
function storeCachedData(object, chosenStore) {
    console.log('inserting: '+JSON.stringify(object));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(chosenStore, 'readwrite');
            var store = tx.objectStore(chosenStore);
            await store.put(object);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(object));
        }).catch(function (error) {
            console.log('error: ' + error)
        });
    }
}

/**
 * Retrieves all the events from the cache
 */
function getCachedEvents() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching all events');
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            return store.openCursor();
        }).then(function allItems(cursor) {
            if (!cursor) {return;}

            // Adds events to a div on the page
            addToEvents(cursor.value);
            return cursor.continue().then(allItems);
        }).then(function() {
            console.log('Done cursoring');
        });
    }
}

/**
 * Retrieves an event from the cache based on ID
 * @param id - the identifier for the event in the database
 * @param callback - callback function
 */
function getCachedEventById(id, callback){
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: event'+id);
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            var index = store.index('_id');
            return index.getAll(IDBKeyRange.only(id));
        }).then(function (itemsList) {
            // Expected to return only one result as id is unique in the database
            console.log(itemsList[0]);
            // Returns the event as a callback
            callback(itemsList[0]);
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}

/**
 * Searches for an event based on name and date
 * Retrieves the event from the cache
 * @param data - search parameters (name and date)
 */
function getCachedSearcedEvents(data){
    let foundList = [];
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: events');
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            return store.openCursor();
        }).then(function allItems(cursor) {
            if (!cursor) {return;}

            //Checks what fields were entered and adding events to foundList
            if (data.name.length != 0 && data.date.length !=0){
                if ((cursor.value.name == data.name) && (cursor.value.date == data.date)) {
                    foundList.push(cursor.value);
                }
            } else {
                if(data.name.length != 0){
                    if (cursor.value.name === data.name){
                        foundList.push(cursor.value);
                    }
                } else if (data.date.length != 0){
                    if (cursor.value.date === data.date){
                        foundList.push(cursor.value);
                    }
                }
            }
            return cursor.continue().then(allItems);
        }).then(function() {
            // Sort and add events to a div on the page
            addToResults(foundList.sort((a, b) => (a.date > b.date) ? 1 : -1));
            console.log('Done cursoring');
        });
    }
}

/**
 * Retrieves all stories related to an event
 * @param name - the name of the event associated to the user story
 */
function getCachedStories(name){
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: stories for event - '+name);
            var tx = db.transaction(STORIES_STORE_NAME, 'readonly');
            var store = tx.objectStore(STORIES_STORE_NAME);
            var index = store.index('event');
            return index.getAll(IDBKeyRange.only(name));
        }).then(function (itemsList) {
            console.log(itemsList);
            if (itemsList && itemsList.length>0 ) {
                for (var elem in itemsList){
                    // Adds each story to a div on the page
                    addToStories(itemsList[elem]);
                }
            }
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}

/**
 * Retrieves all comments related to an event
 * @param eventID - the identifier for the event in the database
 */
function getCachedComments(eventID){
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: comments for event - '+name);
            var tx = db.transaction(COMMENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(COMMENTS_STORE_NAME);
            var index = store.index('event');
            return index.getAll(IDBKeyRange.only(eventID));
        }).then(function (itemsList) {
            if (itemsList && itemsList.length>0 ) {
                for (var elem in itemsList){
                    // Adds each comment to a div on the page
                    addToComments(itemsList[elem]);
                }
            }
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}
////////////////// MONGODB //////////////////

/**
 * Retrieves all the events from the mongo database
 */
function getEvents(){
    $.ajax({
        url: '/getEvents' ,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            console.log("Here is event data:");
            console.log(dataR);
            loadEventList(dataR);
            dataR.forEach(data =>{
                console.log(data._id);
                addToEvents(data);
            });
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
            console.log('Falling back to cache - getEvents');
            getCachedEvents();
        }
    });
}

/**
 * Retrieves an event from mongoDB based on ID
 * @param id - the identifier for the event in the database
 */
function getEventById(id){
    $.ajax({
        url: '/getEvent' ,
        dataType: 'json',
        type: 'POST',
        data: {id: id},
        success: function (dataR) {
            console.log("Here is event data:");
            console.log(dataR);
            loadEventData(dataR);
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
            console.log('Falling back to cache - getEventById');
            getCachedEventById(id, dataR => loadEventData(dataR));
        }
    });
}

/**
 * Retrieves all stories related to an event from mongoDB
 * @param name - the name of the event associated to the user story
 */
function getStories(name){
    $.ajax({
        url: '/getStories' ,
        dataType: 'json',
        type: 'POST',
        data: {name: name},
        success: function (dataR) {
            console.log("Here is story data:");
            console.log(dataR);
            dataR.forEach(data =>{
                addToStories(data);
            });
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
            console.log('Falling back to cache - getStories');
            getCachedStories(name);
        }
    });
}

/**
 * Retrieves all comments related to an event from mongoDB
 * @param id - the identifier for the event in the database
 */
function getComments(id){
    $.ajax({
        url: '/getComments' ,
        dataType: 'json',
        type: 'POST',
        data: {id: id},
        success: function (dataR) {
            console.log("Here is comment data:");
            console.log(dataR);
            dataR.forEach(data =>{
                addToComments(data);
            });
        },
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
            console.log('Falling back to cache - getComments');
            getCachedComments(id);
        }
    });
}

//////////////////// EVENT FUNCTIONS //////////////////
/**
 * given the server data, it returns the value of id
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getID(dataR) {
    if (dataR._id == null && dataR._id === undefined)
        return "unavailable";
    return dataR._id
}

/**
 * given the server data, it returns the value of the name
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getEventname(dataR) {
    if (dataR.name == null && dataR.name === undefined)
        return "unavailable";
    return dataR.name
}

/**
 * given the server data, it returns the value of the date
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getEventdate(dataR) {
    if (dataR.date == null && dataR.date === undefined)
        return "unavailable";
    return dataR.date
}

/**
 * given the server data, it returns the value of the description
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getEventdescription(dataR) {
    if (dataR.description == null && dataR.description === undefined)
        return "unavailable";
    return dataR.description
}

/**
 * given the server data, it returns the value of the latitude
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getLatitude(dataR) {
    if (dataR.latitude == null && dataR.latitude === undefined)
        return "unavailable";
    return dataR.latitude
}

/**
 * given the server data, it returns the value of the longitude
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getLongitude(dataR) {
    if (dataR.longitude == null && dataR.longitude === undefined)
        return "unavailable";
    return dataR.longitude
}

/////////////////// STORY FUNCTIONS //////////////////////
/**
 * given the server data, it returns the value of the username
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getUsername(dataR) {
    if (dataR.user == null && dataR.user === undefined)
        return "unavailable";
    return dataR.user
}

/**
 * given the server data, it returns the value of the event (name)
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getEvent(dataR) {
    if (dataR.event == null && dataR.event === undefined)
        return "unavailable";
    return dataR.event
}

/**
 * given the server data, it returns the value of the date
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getDate(dataR) {
    if (dataR.date == null && dataR.date === undefined)
        return "unavailable";
    return dataR.date
}

/**
 * given the server data, it returns the value of the time
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getTime(dataR) {
    if (dataR.time == null && dataR.time === undefined)
        return "unavailable";
    return dataR.time
}

/**
 * given the server data, it returns the value of the story
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getStory(dataR) {
    if (dataR.story == null && dataR.story === undefined)
        return "unavailable";
    return dataR.story
}

/**
 * given the server data, it returns the photo
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getPhoto(dataR) {
    if (dataR.photo == null && dataR.photo === undefined)
        return "unavailable";
    return (dataR.photo).replace('/public', '');
}

//////////////////// COMMENT FUNCTIONS //////////////////
/**
 * given the server data, it returns the value of the comment
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getComment(dataR) {
    if (dataR.comment == null && dataR.comment === undefined)
        return "unavailable";
    return dataR.comment
}