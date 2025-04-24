
let currentsong = new Audio();
let songs;
let currfolder;

function secondtominitue(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minitues = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);

    const formattedminitues = String(minitues).padStart(2, "0");
    const formattedseconds = String(remainingseconds).padStart(2, "0");

    return `${formattedminitues}:${formattedseconds}`

}


async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)

    let responce = await a.text()
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            b = element.href.split(`/${folder}/`)[1]
            songs.push(b)
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
        
                                                    <img src="img/music.svg" alt="" class="invert">
                                                    <div class="info">
                                                        <div>${song.replaceAll("%20", " ")}</div>
                                                        <div>Jeel</div>
                                                    </div>
                                                    <div class="playnow">
                                                        <span>Play now</span>
                                                        <img class="invert" src="img/play.svg" alt="">
                                                    </div>
        
                                                </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    return songs
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}
async function displayAlbums() {
    let a = await fetch(`/Songs`)
    let responce = await a.text()
    let div = document.createElement("div");
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json();

            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"
                                color="#000000" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#1ED760" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                        <img src="/Songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description} </p>
                    </div>`

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0] )
        })
    })
}

async function main() {

    await getsongs("Songs/ncs");
    playmusic(songs[0], true)


    await displayAlbums();

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondtominitue(currentsong.currentTime)} / ${secondtominitue(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration) * percent / 100;

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index + 1) < (songs.length)) {
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if(currentsong.volume > 0){
            document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("img/mute.svg","img/volume.svg");
        }
        else if(currentsong.volume == 0){
            document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("img/volume.svg","img/mute.svg");
        }
    })

    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentsong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()