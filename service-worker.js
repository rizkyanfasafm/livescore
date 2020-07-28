importScripts('./workbox-sw.js');

if(workbox){
    workbox.precaching.precacheAndRoute([
        {url: '/', revision: '1'},
        {url: '/index.html', revision: '1'},
        {url: '/nav.html', revision: '1'},
        {url: '/detail-match.html', revision: '1'},
        {url: '/detail-standing.html', revision: '1'},
        {url: '/clubs.html', revision: '1'},
        {url: '/club.html', revision: '1'},
        {url: '/pages/league.html', revision: '1'},
        {url: '/pages/home.html', revision: '1'},
        {url: '/pages/saved.html', revision: '1'},
        {url: '/pages/standings.html', revision: '1'},
        {url: '/css/materialize.min.css', revision: '1'},
        {url: '/css/style.css', revision: '1'},
        {url: '/js/api.js', revision: '1'},
        {url: '/js/club.js', revision: '1'},
        {url: '/js/db.js', revision: '1'},
        {url: '/js/idb.js', revision: '1'},
        {url: '/js/init-sw.js', revision: '1'},
        {url: '/js/materialize.min.js', revision: '1'},
        {url: '/js/nav.js', revision: '1'},
        {url: '/js/permission.js', revision: '1'},
        {url: '/js/clubs.js', revision: '1'},
        {url: '/js/detail-match.js', revision: '1'},
        {url: '/js/detail-standing.js', revision: '1'},
        {url: '/js/initindex.js', revision: '1'},
        {url: '/js/circle-loading.js', revision: '1'},
        {url: '/img/logo/kibol192x192.png', revision: '1'},
        {url: '/img/logo/kibol512x512.png', revision: '1'},
        {url: '/img/logo_kibol.png', revision: '1'},
        {url: '/img/club_logo/logo_default.png', revision: '1'},
        {url: '/manifest-fcm.json', revision: '1'},
        {url: '/manifest.json', revision: '1'},
        {url: '/push.js', revision: '1'},
        {url: '/service-worker.js', revision: '1'},
        {url: '/workbox-sw.js', revision: '1'},
    ], {
        ignoreUrlParametersMatching: [/.*/]
    });
    
    // Menyimpan data api
    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/v2/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'api'
        })
    );
    
    // Menyimpan cache dari CSS Google Fonts
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );
    
    // Menyimpan cache untuk file font selama 1 tahun
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        ({url}) => url.origin === 'https://api.football-data.org/v2/',
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'assets'
        })
    )
    console.log('Workbox berhasil dimuat');
}else{
    console.log('Workbox gagal dimuat')
}

self.addEventListener('push', function(event){
    let body;
    if(event.data){
        body = event.data.text();
    }else{
        body = 'Push message no payload';
    }

    const options = {
        body: body,
        vibrate: [100,50,100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
})