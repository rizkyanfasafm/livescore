document.addEventListener("DOMContentLoaded", function() {
    const url = window.location.hash.substr(1);
    if(url === ''){
        getSchedules();
    }
});