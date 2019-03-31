////////////////// DATABASE //////////////////
// the database receives from the server the following structures
/**
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
 *
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

var dbPromise;

const APP_DB_NAME = 'db_pwa_1';
const STORIES_STORE_NAME = 'store_user_stories';
const EVENTS_STORE_NAME = 'store_events';

/**
 * it initializes the database
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
        }
    });
}

/**
 * it saves an object (event or user story) in localStorage
 * @param object StoryObject or EVentsObject
 * @chosenStore the store name to save the object to
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
 * it retrieves all the events from the database
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
            //console.log('Cursored at:', cursor.key);

            // Adds events to a div on the page
            addToEvents(cursor.value);
            return cursor.continue().then(allItems);
        }).then(function() {
            console.log('Done cursoring');
        });
    }
}

/**
 * it retrieves an event from the database
 * @param id the identifier for the event in the database
 * @param callback - callback function
 */
function getEventById(id, callback){
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: event'+id);
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            return store.getAll(IDBKeyRange.only(id));
        }).then(function (itemsList) {
            // Expected to return only one result as id is unique in the database
            //TODO - add some checks
            console.log(itemsList[0]);
            // Returns the event as a callback
            callback(itemsList[0]);
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}

/**
 * it retrieves all stories related to an event
 * @param name the name of the event associated to the user story
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


/////////////////// STORY FUNCTIONS //////////////////////
/**
 * given the server data, it returns the value of the username
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getUsername(dataR) {
    if (dataR.username == null && dataR.username === undefined)
        return "unavailable";
    return dataR.username
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
    return dataR.photo
}

//////////////////// EVENT FUNCTIONS //////////////////
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

//////////////////// Users //////////////////
