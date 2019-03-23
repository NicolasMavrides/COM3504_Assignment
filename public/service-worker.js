var dataCacheName = 'eventsData-v1';
var cacheName = 'eventsPWA';

var filesToCache = [
    '/',
    '/bootstrap/css/bootstrap.css',
    '/bootstrap/js/bootstrap.bundle.js',
    '/bootstrap/js/bootstrap.js',
    '/fontawesome-free/css/all.css',
    '/fontawesome-free/css/brands.css',
    '/fontawesome-free/css/fontawesome.css',
    '/fontawesome-free/css/regular.css',
    '/fontawesome-free/css/solid.css',
    '/fontawesome-free/css/svg-with-js.css',
    '/fontawesome-free/css/v4-shims.css',
    '/fontawesome-free/js/all.js',
    '/fontawesome-free/js/brands.js',
    '/fontawesome-free/js/fontawesome.js',
    '/fontawesome-free/js/regular.js',
    '/fontawesome-free/js/solid.js',
    '/fontawesome-free/js/v4-shims.js',
    '/fontawesome-free/less/_animated.less',
    '/fontawesome-free/less/_bordered-pulled.less',
    '/fontawesome-free/less/_core.less',
    '/fontawesome-free/less/_fixed-width.less',
    '/fontawesome-free/less/_icons.less',
    '/fontawesome-free/less/_larger.less',
    '/fontawesome-free/less/_list.less',
    '/fontawesome-free/less/_mixins.less',
    '/fontawesome-free/less/_rotated-flipped.less',
    '/fontawesome-free/less/_screen-reader.less',
    '/fontawesome-free/less/_shims.less',
    '/fontawesome-free/less/_stacked.less',
    '/fontawesome-free/less/_variables.less',
    '/fontawesome-free/less/brands.less',
    '/fontawesome-free/less/fontawesome.less',
    '/fontawesome-free/less/regular.less',
    '/fontawesome-free/less/solid.less',
    '/fontawesome-free/less/v4-shims.less',
    '/fontawesome-free/scss/_animated.scss',
    '/fontawesome-free/scss/_bordered-pulled.scss',
    '/fontawesome-free/scss/_core.scss',
    '/fontawesome-free/scss/_fixed-width.scss',
    '/fontawesome-free/scss/_icons.scss',
    '/fontawesome-free/scss/_larger.scss',
    '/fontawesome-free/scss/_list.scss',
    '/fontawesome-free/scss/_mixins.scss',
    '/fontawesome-free/scss/_rotated-flipped.scss',
    '/fontawesome-free/scss/_screen-reader.scss',
    '/fontawesome-free/scss/_shims.scss',
    '/fontawesome-free/scss/_stacked.scss',
    '/fontawesome-free/scss/_variables.scss',
    '/fontawesome-free/scss/brands.scss',
    '/fontawesome-free/scss/fontawesome.scss',
    '/fontawesome-free/scss/regular.scss',
    '/fontawesome-free/scss/solid.scss',
    '/fontawesome-free/scss/v4-shims.scss',
    '/fontawesome-free/sprites/brands.svg',
    '/fontawesome-free/sprites/regular.svg',
    '/fontawesome-free/sprites/solid.svg',
    //TODO /fontawesome-free/svgs,
    '/fontawesome-free/webfonts/fa-brands-400.eot',
    '/fontawesome-free/webfonts/fa-brands-400.svg',
    '/fontawesome-free/webfonts/fa-brands-400.ttf',
    '/fontawesome-free/webfonts/fa-brands-400.woff',
    '/fontawesome-free/webfonts/fa-brands-400.woff2',
    '/fontawesome-free/webfonts/fa-regular-400.eot',
    '/fontawesome-free/webfonts/fa-regular-400.svg',
    '/fontawesome-free/webfonts/fa-regular-400.ttf',
    '/fontawesome-free/webfonts/fa-regular-400.woff',
    '/fontawesome-free/webfonts/fa-regular-400.woff2',
    '/fontawesome-free/webfonts/fa-solid-900.eot',
    '/fontawesome-free/webfonts/fa-solid-900.svg',
    '/fontawesome-free/webfonts/fa-solid-900.ttf',
    '/fontawesome-free/webfonts/fa-solid-900.woff',
    '/fontawesome-free/webfonts/fa-solid-900.woff2',
    '/images/about-bg.jpg',
    '/images/home-bg.jpg',
    '/javascripts/clean-blog.js',
    '/javascripts/clean-blog.min.js',
    '/javascripts/app.js',
    '/javascripts/idb.js',
    '/jquery/jquery.js',
    '/jquery/jquery.min.js',
    '/jquery/jquery.slim.js',
    '/jquery/jquery.slim.min.js',
    '/jquery/jquery.min.map',
    '/jquery/jquery.slim.min.map',
    '/stylesheets/clean-blog.css',
    '/stylesheets/clean-blog.min.css',
    '/stylesheets/style.css'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cached files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});

/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 */
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
    // TODO control flow for fetching pages - caching strategy
});