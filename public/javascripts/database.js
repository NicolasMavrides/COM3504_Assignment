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

const STORIES_DB_NAME= 'db_stories_1';
const STORIES_STORE_NAME= 'store_user_stories';

/**
 * it inits the database
 */
function initDatabase(){
    dbPromise = idb.openDb(STORIES_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORIES_STORE_NAME)) {
            var storiesDB = upgradeDb.createObjectStore(STORIES_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storiesDB.createIndex('event', 'event', {unique: false, multiEntry: true});
        }
    });
}

/**
 * it saves the user story for an event in localStorage
 */
function storeCachedData(storyObject) {
    console.log('inserting: '+JSON.stringify(storyObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(STORIES_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORIES_STORE_NAME);
            await store.put(storyObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(storyObject));
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
function getCachedData() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching');
            var tx = db.transaction(STORIES_STORE_NAME, 'readonly');
            var store = tx.objectStore(STORIES_STORE_NAME);
            return store.openCursor();
            //var index = store.index('location');
            //return index.getAll(IDBKeyRange.only(city));
        }).then(function allItems(cursor) {
            if (!cursor) {return;}
            console.log('Cursored at:', cursor.key);
            addToResults(cursor.value);
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