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
    'endpoint': "https://fcm.googleapis.com/fcm/send/cI1J1LXoAKk:APA91bHjnGPfjroFTYWoAfgm9cl0IqgTma8HsAhgf_mtOqf3i0TGZM9A4ZYwKE39fCBIWDYqwY9doRpcvczn4I_7CIsK9x28XrIkBKbKGKydKqHCiOEBHeHOaQk6GqGvxYEyFGnLWEo5",
    'keys': {
        'p256dh': 'BMHuZQPjIYnH48cwicrFK59hIVguLTLVAlU58aZtxv0SfjRHCPc4bJwkL83CN4nT3xuuMHVSu/6UBayeB4Ozidc=',
        'auth': 'Qt77cePFZKf55kvnoJ2zeA=='
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