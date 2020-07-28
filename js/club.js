document.addEventListener('DOMContentLoaded', function(){
    const urlParam = new URLSearchParams(window.location.search);
    const idParam = parseInt(urlParam.get('id'),10);
    const isFromSaved = urlParam.get('saved');

    const btn = document.getElementById('save');
    const icon = document.getElementById('icon');

    let item;

    if(isFromSaved){
        btn.style.display = 'inline-block';
        icon.innerText = 'remove';
        getMyClub();
        btn.onclick = function(){
            deleteMyClub(idParam)
            .then(function(result){
                if(result === true){
                    M.toast({html: 'Sukses menghapus club favorit anda'});
                    window.location = './index.html#saved';
                }else{
                    M.toast({html: 'Gagal menghapus club favorit anda'})
                }
            })
            .catch(err => M.toast({html: `Gagal menghapus club favorit anda di karenakan ${err}`}))
        }
    }else{
        getClubById(idParam).then(function(result){
            if(result !== undefined){
                btn.style.display = 'none'
            }
        });
        item = getClub();
        btn.onclick = function(){
            item.then(function(club){
                saveMyClub(club)
                    .then(function(result){
                        if(result === true){
                            M.toast({html: 'Sukses menambahkan club favorit anda'});
                            location.reload();
                        }else{
                            M.toast({html: 'Gagal menambahkan club favorit anda'})
                        }
                    })
                    .catch(err => M.toast({html: `Gagal menambahkan club favorit anda di karenakan ${err}`}))
            })
        }
    }
})