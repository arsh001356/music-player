const mainBtn = document.querySelector(".mainPlay-btn");
const forwardBtn = document.querySelector(".forward-btn");
const backwardBtn = document.querySelector(".backward-btn");
const dot = document.querySelector(".dot");
const displayDuration = document.querySelector(".displayDuration");
const displayTime = document.querySelector(".displayTime");
const mute = document.querySelector(".mute");
const range = document.querySelector("#range");
const speed = document.querySelector(".speed");
const currentVolume = document.querySelector(".currentVolume");
let curr = 0;
let dotIntervalId;
let dotPos = 0;
let click = 0;

let songsBtn = [
    document.querySelector(".song1"),
    document.querySelector(".song2"),
    document.querySelector(".song3"),
    document.querySelector(".song4"),
    document.querySelector(".song5"),
]

let songs = [
    new Audio('../MORNI  Official Video  RAFTAAR X SUKH-E FT. BHUMIKA SHARMA  SOUNDOUS MOUFAKIR  AVVY SRA  JAANI.mp3'),
    new Audio("../Aapke Pehlu Mein Aakar _ Mohd. Rafi _ Madan Mohan _ Raja Mehdi Ali Khan _ Mera Saaya - 1966(MP3_160K)_1.mp3"),
    new Audio("../Lukas Graham - 7 Years.mp3"),
    new Audio("../TERE HO KE.mp3"),
    new Audio("../Akon - Lonely.mp3"),
];
function changeBtn() {
    songsBtn.forEach((element, index) => {
        if (!songs[index].paused || songs[curr].ended === true) {
            element.classList.remove("fa-play")
            element.classList.add("fa-pause")
        }
        else {
            element.classList.remove("fa-pause");
            element.classList.add("fa-play");
        }
    });

    if (songs[curr].paused) {
        mainBtn.classList.remove("fa-pause");
        mainBtn.classList.add("fa-play");

    }
    else {
        mainBtn.classList.remove("fa-play");
        mainBtn.classList.add("fa-pause");
    }
}

function resetAllMusic() {
    songs.forEach((element, index) => {
        if (curr !== index) {
            element.load()
        }
    });
}

function currentPlaying() {
    if (songs[curr].paused) {
        songs[curr].play()

        resetAllMusic()
        showDuration()
        dotMove()
    }

    else {
        songs[curr].pause()
        stopDot()
    }
    changeBtn()
}



mainBtn.addEventListener("click", () => {
    currentPlaying()
});
forwardBtn.addEventListener("click", () => {
    if (curr !== 4 && (!songs[curr].paused)) {
        curr++;
        currentPlaying()
        resetDot()
        changeBtn()

        click = 3;
        speedChanger()


    }
})
backwardBtn.addEventListener("click", () => {
    if (curr !== 0) {
        curr--;
        currentPlaying()
        resetDot()
        changeBtn()
        click = 3;
        speedChanger()
    }
})

function dotMove() {
    dotIntervalId = setInterval(() => {
        dotPos = (songs[curr].currentTime / songs[curr].duration) * 100;


        if (songs[curr].played.length > 0) {
            timeSeconds = songs[curr].played.end(0);
        } else {
            timeSeconds = songs[curr].currentTime;
        }

        timeMinutes = Math.floor(timeSeconds / 60);
        timeRemainingSeconds = Math.floor(timeSeconds % 60);
        dot.style.left = dotPos + "%";

        if (songs[curr].ended === true) {
            resetDot();
            songs[curr].load();
            if (curr !== 4) {
                curr++;
                currentPlaying();
                changeBtn();
                click = 3;
                speedChanger();
            } else {
                curr = 0;
                currentPlaying();
                changeBtn();
                click = 3;
                speedChanger();
            }
        }

        displayTime.innerText = `${timeMinutes}:${timeRemainingSeconds < 10 ? '0' : ''}${timeRemainingSeconds} /`;
    }, 16);
}


function stopDot() {
    clearInterval(dotIntervalId)
}


function showDuration() {
    let seconds = songs[curr].duration
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    displayDuration.innerText = ` ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
function showTime() {
    let Time = songs[curr].currentTime / songs[curr].duration
    displayTime.innerText = Time
}

function resetDot() {
    clearInterval(dotIntervalId)
    dotPos = 0;
    dot.style.left = "0px"
    songsBtn[curr].classList.remove("fa-pause");
    songsBtn[curr].classList.add("fa-play");
}
mute.addEventListener("click", () => {
    muteUnMute()
})

function muteUnMute() {
    mute.classList.remove("fa-volume-high")
    mute.classList.add("fa-volume-xmark")
    if (songs[curr].muted !== true) {
        songs[curr].muted = true
        range.value = 0;
        currentVolume.innerText = `0%`
        mute.classList.remove("fa-volume-high")
        mute.classList.add("fa-volume-xmark")
    } else {
        songs[curr].muted = false
        range.value = songs[curr].volume * 100
        volumePercent()
        mute.classList.add("fa-volume-high")
        mute.classList.remove("fa-volume-xmark")
    }


}

function setVolume() {
    if ((range.value / 100) === 0) {
        muteUnMute()
    }
    else if ((range.value / 100) > 0) {
        mute.classList.add("fa-volume-high")
        mute.classList.remove("fa-volume-xmark")
        if (songs[curr].muted === true) {
            songs[curr].muted = false
        }
    }
    songs[curr].volume = range.value / 100
    volumePercent()
}
function speedChanger() {
    click++;
    switch (click) {

        case 1: speed.innerText = "1.5x"
            songs[curr].playbackRate = 1.5
            break;
        case 2: speed.innerText = "2x"
            songs[curr].playbackRate = 2
            break;
        case 3: speed.innerText = "0.5x"
            songs[curr].playbackRate = 0.5
            break;
        case 4: speed.innerText = "1x"
            songs[curr].playbackRate = 1
            click = 0
            break;

    }
}

speed.addEventListener("click", speedChanger)

function volumePercent() {
    currentVolume.innerText = `${Math.floor(songs[curr].volume * 100)}%`
}

songsBtn.forEach((element, index) => {
    element.addEventListener("click", () => {
        curr = index
        currentPlaying()
    })
})

//ends