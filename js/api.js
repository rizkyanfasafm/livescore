const BASE_URL = 'https://api.football-data.org/v2/';
const myHeaders = new Headers({
    'Access-Control-Request-Headers': '*',
    'X-Auth-Token': '20c6cf6038c5435d8c130191d2b578d3',
});
const defaultImage = './img/club_logo/logo_default.png';

function status(response){
    if(response.status !== 200){
        return Promise.reject(new Error(response.statusText));
    }else{
        return Promise.resolve(response);
    }
}

function json(response){
    return response.json();
}

function error(error){
    console.log('Error: ' + error);
}

const fetchData = url => {
    return new Promise((resolve,reject) => {
        fetch(url, {
            mode: 'cors',
            headers: myHeaders
        })
        .then(status)
        .then(json)
        .then(response => resolve(response))
        .catch(err => reject(err))
    })
}

const idParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const isScoreNull = score => score === null ? 0 : score;

const statusMatch = status => status.replace('_', ' ');
const colorScore = (firstScore, secondScore) => firstScore > secondScore ? '#051B32' : '#D9D9D9';

const getLogoClub = (id) => {
    const url = BASE_URL+"teams/"+id;
    return new Promise((resolve,reject) => {
        if('caches' in window){
            caches.match(url).then(function(response){
                if(response){
                    response.json().then(function(data){
                        resolve(data.crestUrl);
                    });
                }else{
                    fetchData(url)
                        .then(data => resolve(data.crestUrl))
                        .catch(err => reject(err))
                }
            })
        }
        else{
            fetchData(url)
                .then(data => resolve(data.crestUrl))
                .catch(err => reject(err))
        }
    });
}

const isImageNullandValid = image => {
    return new Promise(resolve => {
        if(image !== null && image !== ""){
            image = image.replace(/^http:\/\//i, 'https://');
            validImage(image)
                .then(response => {
                    if(response.status === 404){
                        resolve(defaultImage)
                    }else{
                        const url = image.replace(/^http:\/\//i, 'https://');
                        resolve(url)
                    }
                })
                .catch(err => resolve(defaultImage))
        }else{
            resolve(defaultImage);
        }
    })
}

const validImage = url => {
    return new Promise((resolve,reject) => {
        fetch(url)
            .then(response => {
                resolve(response)
            })
            .catch(err => reject(err))
    })
};

function getSchedules(){
    const url = BASE_URL+"matches";
    if('caches' in window){
        caches.match(url)
            .then(function(response){
                if(response){
                    response.json().then(cardSchedule)
                }else{
                    fetchData(url)
                        .then(cardSchedule)
                        .catch(error)
                }
            })
            .catch(error);
    }else{
        fetchData(url)
            .then(cardSchedule)
            .catch(error)
    }
}

function cardSchedule(data){
    let schedulesHTML = "";
            data.matches.forEach(function(schedule){
                const scoreHome = isScoreNull(schedule.score.fullTime.homeTeam);
                const scoreAway = isScoreNull(schedule.score.fullTime.awayTeam);
                const status = statusMatch(schedule.status);
                const colorHomeScore = colorScore(scoreHome,scoreAway);
                const colorAwayScore = colorScore(scoreAway,scoreHome);
                schedulesHTML += `
                    <div class="col s12 m6 l6 xl4">
                        <div class="card-schedule">
                            <h4>${schedule.competition.name}</h4>
                            <p>${schedule.group}</p>
                            <div class="result">
                                <div class="home">
                                    <p>${schedule.homeTeam.name}</p>
                                </div>
                                <div class="score">
                                    <span style="color:${colorHomeScore}" class="home">${scoreHome}</span>
                                    <span>:</span>
                                    <span style="color:${colorAwayScore}" class="away">${scoreAway}</span>
                                </div>
                                <div class="away">
                                    <p>${schedule.awayTeam.name}</p>
                                </div>
                            </div>
                            <h6 class="center-align">${status}</h6>
                            <hr>
                            <a href="./detail-match.html?id=${schedule.id}">Match Details</a>
                        </div>
                    </div>
                `;
            });
    document.getElementById('schedules').innerHTML = schedulesHTML;
}

function getMatchById(){
    const id = idParam('id');
    const url = BASE_URL+"matches/"+id;
    if('caches' in window){
        caches.match(url)
            .then(function(response){
                if(response){
                    response.json().then(cardMatch)
                }else{
                    fetchData(url)
                        .then(cardMatch)
                        .catch(error)
                }
            })
            .catch(error)
    }else{
        fetchData(url)
            .then(cardMatch)
            .catch(error)
    }
}

async function cardMatch(data){
    const scoreHome = isScoreNull(data.match.score.fullTime.homeTeam);
    const scoreAway = isScoreNull(data.match.score.fullTime.awayTeam);
    const status = statusMatch(data.match.status);

    try{
        const logoHome = await getLogoClub(data.match.homeTeam.id).then(isImageNullandValid);
        const logoAway = await getLogoClub(data.match.awayTeam.id).then(isImageNullandValid);
        const dateConvert = new Date(data.match.utcDate);
        const day = dateConvert.toLocaleDateString('en-US', {weekday:'long'});
        const date = dateConvert.getDate() + "-" + dateConvert.getMonth() + "-" + dateConvert.getFullYear();
        const time = dateConvert.toLocaleTimeString();

        const detailMatch = `
            <div class="row">
                <div class="col s12 m6 offset-m3 l6 offset-l3 xl6 offset-xl3" id="detail-match">
                    <h4>${data.match.competition.name}</h4>
                    <p>${data.match.group}</p>
                    <div class="result">
                        <div class="home">
                            <img src="${logoHome}" width="50%" alt="Logo ${data.match.homeTeam.name}">
                            <p>${data.match.homeTeam.name}</p>
                        </div>
                        <div class="score">
                            <span class="home">${scoreHome}</span>
                            <span>:</span>
                            <span class="away">${scoreAway}</span>
                        </div>
                        <div class="away">
                            <img src="${logoAway}" width="50%" alt="Logo ${data.match.awayTeam.name}">
                            <p>${data.match.awayTeam.name}</p>
                        </div>
                    </div>
                    <h6 class="center-align">${status}</h6>
                    <div id="detail-date">
                        <span id="date">Date:</span>
                        <span id="date-match">${day}, ${date}</span>
                    </div>
                    <div id="detail-time">
                        <span id="time">Time:</span>
                        <span id="time-match">${time}</span>
                    </div>
                    <div id="detail-venue">
                        <span id="venue">Venue:</span>
                        <span id="venue-match">${data.match.venue}</span>
                    </div>
                </div>
            </div>
            `
        document.getElementById('body-content').innerHTML = detailMatch;
    }catch(err){
        error(err)
    }
}

function getStandingbyId(){
    const id = idParam('id');
    const url = BASE_URL+"competitions/"+id+"/standings";

    if('caches' in window){
        caches.match(url).then(function(response){
            if(response){
                response.json().then(cardStanding)
            }else{
                fetchData(url)
                    .then(cardStanding)
                    .catch(error)
            }
        })
    }else{
        fetchData(url)
            .then(cardStanding)
            .catch(error)
    }
}

function cardStanding(data){
    let bodyStandings = ``;
    data.standings[0].table.forEach(standing => {
        bodyStandings += `
        <tr>
            <td>${standing.position}</td>
            <td>${standing.team.name}</td>
            <td>${standing.playedGames}</td>
            <td>${standing.won}</td>
            <td>${standing.draw}</td>
            <td>${standing.lost}</td>
            <td>${standing.points}</td>
            <td>${standing.goalsFor}</td>
            <td>${standing.goalsAgainst}</td>
            <td>${standing.goalDifference}</td>
        </tr>
        `;
    })
    document.getElementById('title-league').innerText = data.competition.name;
    document.getElementById('body-standing').innerHTML = bodyStandings;
}

function getClubs(){
    const id = idParam('id');
    const url = BASE_URL+"competitions/"+id+"/teams";

    if('caches' in window){
        caches.match(url).then(function(response){
            if(response){
                response.json().then(cardClubs)
            }else{
                fetchData(url)
                    .then(cardClubs)
                    .catch(error)
            }
        })
    }else{
        fetchData(url)
            .then(cardClubs)
            .catch(error)
    }
}

async function cardClubs(data){
    let clubs = ``;
    for(let i = 0; i < data.teams.length; i++){
        try{
            const logo = await isImageNullandValid(data.teams[i].crestUrl);
            clubs += `
            <div class="col s12 m6 l4 xl3">
                <a href="./club.html?id=${data.teams[i].id}&comp=${data.competition.id}">
                    <div class="card-clubs waves-effect" style="background-image: url(${logo}); display:block;">
                        <p>${data.teams[i].name}</p>
                    </div>
                </a>
            </div>
        `;
        }catch(err){
            error(err)
        }
    }

    document.getElementById('title-league').innerText = data.competition.name;
    document.getElementById('body-content').innerHTML = clubs;
}

function getClub(){
    return new Promise(resolve => {
        const idClubParam = idParam('id');
        const idCompParam = idParam('comp');
        const url = BASE_URL+"competitions/"+idCompParam+"/teams";

        if('caches' in window){
            caches.match(url).then(function(response){
                if(response){
                    response.json().then(function(data){
                        const club = data.teams.filter(club => club.id == idClubParam);
                        cardClub(club[0], idCompParam);
                        resolve(club[0])
                    })
                }else{
                    fetchData(url)
                        .then(data => {
                            const club = data.teams.filter(club => club.id == idClubParam);
                            cardClub(club[0], idCompParam);
                            resolve(club[0])
                        })
                        .catch(error)
                }
            });
        }else{
            fetchData(url)
                .then(data => {
                    const club = data.teams.filter(club => club.id === idClubParam);
                    cardClub(club[0], idCompParam);
                    resolve(club[0])
                })
                .catch(error)
        }
    })
}

async function cardClub(data, comp){
    try{
        const logo = await isImageNullandValid(data.crestUrl);
        const club = `
        <h5>${data.name}</h5>
        <div id="detail-club">
            <div class="col s12 m12 l5 xl5 center-align">
                <img src="${logo}" id="logo-club" alt="Logo ${data.name}">
            </div>
            <div class="col s12 m12 l7 xl7">
                <p id="name">Name</p>
                <p id="team-name">${data.name}</p>
                <p id="address">Address</p>
                <p id="team-address">${data.address}</p>
                <p id="founded">Founded</p>
                <p id="team-founded">${data.founded}</p>
                <p id="venue">Venue</p>
                <p id="team-venue">${data.venue}</p>
                <p id="website">Website</p>
                <p id="team-website">${data.website}</p>
            </div>
        </div>
        `;
        document.getElementById('club').innerHTML = club;
        document.getElementById('back-btn').setAttribute('href', `./clubs.html?id=${comp}`);
    }catch(err){
        error(err)
    }
}

function getMyClubs(){
    getAll().then(async function(myclubs){
        let clubs = ``;
        for(let i = 0; i < myclubs.length; i++){
            try {
                const logo = await isImageNullandValid(myclubs[i].crestUrl).then(image => image);
                clubs += `
                    <div class="col s12 m6 l4 xl3">
                        <a href="./club.html?id=${myclubs[i].id}&saved=true">
                            <div class="card-clubs waves-effect" style="background-image: url(${logo}); display:block;">
                                <p>${myclubs[i].name}</p>
                            </div>
                        </a>
                    </div>
                `;
            }catch(err){
                error(err);
            }
        }
        document.getElementById('clubs').innerHTML = clubs;
    })
}

function getMyClub(){
    const id = parseInt(idParam('id'));

    getClubById(id).then(async function(data){
        try {
            const logo = await isImageNullandValid(data.crestUrl).then(image => image);
            const club = `
                <h5>${data.name}</h5>
                <div id="detail-club">
                    <div class="col s12 m12 l5 xl5 center-align">
                        <img src="${logo}" id="logo-club" alt="Logo ${data.name}">
                    </div>
                    <div class="col s12 m12 l7 xl7">
                        <p id="name">Name</p>
                        <p id="team-name">${data.name}</p>
                        <p id="address">Address</p>
                        <p id="team-address">${data.address}</p>
                        <p id="founded">Founded</p>
                        <p id="team-founded">${data.founded}</p>
                        <p id="venue">Venue</p>
                        <p id="team-venue">${data.venue}</p>
                        <p id="website">Website</p>
                        <p id="team-website">${data.website}</p>
                    </div>
                </div>
            `;
            document.getElementById('club').innerHTML = club;
            document.getElementById('back-btn').setAttribute('href', `./index.html#saved`);
        }catch(err){
            error(err);
        }
    });
}