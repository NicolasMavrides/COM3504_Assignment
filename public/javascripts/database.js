////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/** class StoryObject{
    constructor (event, user, date, time, story) {
        this.event = event;
        this.user = user;
        this.date = date;
        this.time = time;
        this.story = story;
    }
}
 */
var dbPromise;

const APP_DB_NAME = 'db_pwa_1';
const STORIES_STORE_NAME = 'store_user_stories';
const EVENTS_STORE_NAME = 'store_events';

/**
 * it inits the database
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
 * it saves the user story for an event in localStorage
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
            //TODO localStorage.setItem(city, JSON.stringify(forecastObject));
        });
    }
    //else localStorage.setItem(city, JSON.stringify(forecastObject));
}


/**
 * it retrieves the user stories for an event from the database
 */
function getCachedEvents() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching all events');
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            return store.openCursor();
            //var index = store.index('location');
            //return index.getAll(IDBKeyRange.only(city));
        }).then(function allItems(cursor) {
            if (!cursor) {return;}
            //console.log('Cursored at:', cursor.key);
            addToEvents(cursor.value);
            /*for (var field in cursor.value) {
                console.log(cursor.value[field]);
            }*/
            return cursor.continue().then(allItems);
        }).then(function() {
            console.log('Done cursoring');
        });
    } /*else {
        const value = localStorage.getItem(city);
        if (value == null)
            addToResults( {city: city, date: date});
        else addToResults(value);
    }*/
}

function getEventById(id, callback){
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: event'+id);
            var tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENTS_STORE_NAME);
            //var index = store.index('name');
            return store.getAll(IDBKeyRange.only(id));
        }).then(function (itemsList) {
            //TODO - add some checks
            console.log(itemsList[0]);
            callback(itemsList[0]);
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}

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
                    addToStories(itemsList[elem]);
                }
            }
        }).catch(function (error) {
            console.log('error: ' + error);
        });
    }
}


/////////////////// Stories //////////////////////
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
 * given the server data, it returns the value of the event
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

//////////////////// Events //////////////////
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