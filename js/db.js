const dbPromised = idb.open('kibol', 1, function(upgradeDB){
    let clubsObjectStore = upgradeDB.createObjectStore('clubs', {
        keyPath: "id"
    });
    clubsObjectStore.createIndex('name', 'name', {unique: false})
})

function saveMyClub(club){
    return new Promise(function(resolve,reject){
        dbPromised
        .then(function(db){
            let tx = db.transaction('clubs', 'readwrite');
            let store = tx.objectStore('clubs');
            store.add(club)
            return tx.complete;
        })
        .then(function(){
            resolve(true);
        })
    })
}

function getAll(){
    return new Promise(function(resolve,reject){
        dbPromised
            .then(function(db){
                let tx = db.transaction('clubs', 'readonly');
                let store = tx.objectStore('clubs');
                return store.getAll();
            })
            .then(function(clubs){
                resolve(clubs);
            })
    })
}

function getClubById(id){
    return new Promise(function(resolve,reject){
        dbPromised.then(function(db){
                let tx = db.transaction('clubs','readonly');
                let store = tx.objectStore('clubs');
                return store.get(id);
            })
            .then(function(club){
                resolve(club);
            })
    });
}

function deleteMyClub(id){
    return new Promise(function(resolve,reject){
        dbPromised.then(function(db){
            let tx = db.transaction('clubs','readwrite');
            let store = tx.objectStore('clubs');
            store.delete(id);
            return tx.complete;
        }).then(function(){
            resolve(true);
        })
    });
}