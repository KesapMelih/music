const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer")
const prev = document.querySelector("#controls #prev")
const play = document.querySelector("#controls #play")
const next = document.querySelector("#controls #next")
const duration = document.querySelector("#duration")
const currentTime = document.querySelector("#current-time")
const progressBar = document.querySelector("#progress-bar")
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar")
const ul = document.querySelector("ul")

const player = new MusicPlayer(musicList);

let music = player.getMusic()
console.log(music.getName())

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music)
    displayMusicList(player.musicList)
    isPlayingNow()
    updateVolumeUI(audio.muted ? 0 : audio.volume * 100);
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file
}
//BAŞLAT - DURDUR BUTONU
play.addEventListener("click", () => {
    if (play.querySelector("i").classList.contains("fa-play")) {
        startMusic();
    } else {
        stopMusic();
    }
});

function stopMusic() {
    audio.pause()
    play.querySelector("i").classList.remove("fa-stop")
    play.querySelector("i").classList.add("fa-play")
}
function startMusic() {
    audio.play();
    play.querySelector("i").classList.remove("fa-play")
    play.querySelector("i").classList.add("fa-stop")
}

//BİR SONRAKİ ŞARKI BUTONU
next.addEventListener("click", () => {
    nextMusic();
    startMusic();
    isPlayingNow()
})
function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    play.querySelector("i").classList.remove("fa-stop")
    play.querySelector("i").classList.add("fa-play")

}
//BİR ÖNCEKİ ŞARKI BUTONU
prev.addEventListener("click", () => {
    prevMusic();
    startMusic();
    isPlayingNow()
})
function prevMusic() {
    player.previous()
    let music = player.getMusic();
    displayMusic(music);
    play.querySelector("i").classList.remove("fa-stop")
    play.querySelector("i").classList.add("fa-play")
}
//PROGRESS BAR 
const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60)
    const saniye = Math.floor(toplamSaniye % 60)
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`;
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc
}
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration)

})
audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime)
    currentTime.textContent = calculateTime(progressBar.value)

})
audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const percentage = (currentTime / duration) * 100;

    progressBar.style.setProperty('--percentage', percentage + '%');
});
//SANİYE İLERLETME
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value)
    audio.currentTime = progressBar.value
})



//SES BUTONU
volume.addEventListener("click", () => {
    if (audio.muted == false) {
        audio.muted = true
        volumeBar.value = 0
        volumeBar.style.setProperty('--percentage', '0%'); // Yolu sıfırla
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-xmark");
    }
    else {
        audio.muted = false
        audio.volume = 1;
        volumeBar.value = 100
        volumeBar.style.setProperty('--percentage', '100%'); // Yolu tamamlanmışa ayarla
        volume.classList.remove("fa-volume-xmark");
        volume.classList.add("fa-volume-high");
    }
})

//SES AYARLAMA
volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100
    volumeBar.style.setProperty('--percentage', value + '%'); // Yolu dinamik olarak ayarla
    if (value >= 1) {
        volume.classList.add("fa-volume-high");
        volume.classList.remove("fa-volume-xmark");
    } else {
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-xmark");
    }

}
)
function updateVolumeUI(volumeValue) {
    if (volumeValue > 0) {
        volumeBar.style.setProperty('--percentage', volumeValue + '%');
    } else {
        volumeBar.style.setProperty('--percentage', '0%');
    }

    if (volumeValue >= 1) {
        volume.classList.add("fa-volume-high");
        volume.classList.remove("fa-volume-xmark");
    } else {
        volume.classList.remove("fa-volume-high");
        volume.classList.add("fa-volume-xmark");
    }
}

//COLLAPSE
const displayMusicList = (list) => {
    for (i = 0; i < list.length; i++) {
        let liTag = `
        <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()} </span>
            <span id="music-${i}" class="badge bg-primary rounded-pill"> </span>
            <audio class="music-${i}" src="mp3/${list[i].file}">
        </li>
        `;
        ul.insertAdjacentHTML("beforeend", liTag)

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration)
        })
    }

}

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index")
    displayMusic(player.getMusic())
    startMusic()
    isPlayingNow()

}

const isPlayingNow = () => {
    for (let li of ul.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing")
        }
        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing")
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
    startMusic()
    isPlayingNow()
})