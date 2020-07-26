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
    'endpoint': "https://fcm.googleapis.com/fcm/send/de8h4H4ZY80:APA91bFUpBbdSFSMb2wOOBHD3I4UhCSzIn1K6Oe9gtHIbqWlDE_zufmbNo5VuvDc4SSHv3Z1apn2sWOlizyOqdQDDCgseYNWmH1pEc0dvCKlYIsQXQ_cAcsfGK9TuakSWYEmjF0-L8DO",
    'keys': {
        'p256dh': 'BK82N1IoftHTn2P5lYmjKbfeXlRK42QMrUCXlfo8V6U0ADBkQDkUmAZpBjBhrU/IqJ4AnG+zIIiE+e43Uy9OQPk=',
        'auth': 'wzoh1+mp4X7Uf/+SY+Vy6g=='
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