const webPush = require('web-push');

const vapidKeys = {
    "publickKey": "BDA5HMqbag2T25K1B7CKv7pbkj4WJxtrb3_YFssyAXVn51Yt4Cal3xmvE_J3KhOibc-LeyGY1YoptUKcvInZLPM",
    "privateKey": "AnCx9M6QUYJbPxEsoplMKb2wfCOML1GT5uV9-2auTOk"
};

webPush.setVapidDetails(
    'mailto:rizkyanfasafm@gmail.com',
    vapidKeys.publickKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    'endpoint': "https://fcm.googleapis.com/fcm/send/d34MhAFRfCw:APA91bG7QPH6KL-3yJe7p_cvgGqXp2EU8fGZp2XTCgp6fY9yY2jwV-iPWYf9P_aU383PwmqXJ-QCtacAWmRSjYsJWewBii72pVhW0AsSFtRJ4lCYgIbJw-Tv4yO3sfH6JDlyXqLwNoJQ",
    'keys': {
        'p256dh': 'BByczcpP8ecER0509rywhnTKjsqZjfb1Jvoey0N1qsaCNYKT/a3Mtl8Xj8IxA1K9qdASWwWbEPdPeNxkDWZhpCY=',
        'auth': 'sLcKO+6/jx1oaL82V/2bmw=='
    }
}

const payload = 'Hiii Selamat Aplikasi dapat push notifikasi!';
let options = {
    gcmAPIKey: '130544014256',
    TTL: 60
}

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);