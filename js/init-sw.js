const url = window.location;
if("serviceWorker" in navigator){
    window.addEventListener('load', function (){
        navigator.serviceWorker.register('./service-worker.js')
        .then(function(){
            console.log('Pendaftaran service worker berhasil');
            if(url.pathname === '/index.html'){
                requestPermission();
            }
        }).catch(function(){
            console.log('Pendaftaran service worker gagal');
        })
    })
}else{
    console.log('Service worker belum mendukung browser ini');
}