
//Importamos scrip externo
importScripts ('/Tuitor/js/sw-utils.js');

const Static_cache    = 'static-v1';
const Dynamic_cache   = 'dynamic-v1';
const Inmutable_cache = 'inmutable-v1';


const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];


const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];


//INSTALACION y creacion de las caches
self.addEventListener('install', e => {

    const cacheStatic = caches.open (Static_cache).then (cache => 
        cache.addAll(APP_SHELL));
    
    const cacheInmutable = caches.open (Inmutable_cache).then (cache => 
        cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all ([cacheStatic, cacheInmutable]));
});



//borramos las caches antiguas
self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== Static_cache && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );


});


//implementamos el cache dinamico o network fallback

self.addEventListener('fetch', e =>{
    
    const respuesta2 = caches.match(e.request).then ( res => {

        if (res) {
            return res;
        } else {
            return fetch(e.request).then (newRes => {
                return actualizaCacheDinamico(Dynamic_cache, e.request, newRes);
            });
        }
    });

    e.respondWith(respuesta2);

});