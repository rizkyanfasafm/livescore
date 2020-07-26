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
            deleteMyClub(idParam).then(function(result){
                if(result === true){
                    window.location = './index.html#saved';
                }
            });
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
                saveMyClub(club).then(function(result){
                    if(result === true){
                        location.reload();
                    }
                });
            })
        }
    }
})