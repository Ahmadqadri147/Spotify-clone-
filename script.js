document.querySelectorAll(".template .icon ").forEach(function (icon) {
  icon.addEventListener("click", function () {
    const template = icon.closest('.template');
    const songPath = template.dataset.song;
    const imgSrc = template.dataset.img;
    const title = template.dataset.title;
    const artist = template.dataset.artist;

    const url = `player.html?song=${encodeURIComponent(songPath)}&img=${encodeURIComponent(imgSrc)}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;

    window.location.href = url;
  });
});

document.querySelectorAll(".header .login , .header .singup , footer .singup").forEach(function (icon) {
  icon.addEventListener("click", function () {
    window.location.href = "login.html", "_blank";
  });
});

document.querySelectorAll(".list .create-playlist .create-icon, .box1-header .plus").forEach(function (icon) {
  icon.addEventListener("click", function () {
    window.location.href = "library.html", "_blank";
  });
});

let currentsong = new Audio();

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = []; 
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      const url = new URL(element.href);
      const filename = decodeURIComponent(url.pathname.split('/').pop()).replace(/^\\songs\\/, "");
      songs.push(filename);
    }
  }
  return songs;
}


const playmusic = (track, pause = false) => {
  if (!track) {
    console.error("No track provided!");
    return;
  }
  let cleanTrack = track.trim().replace(/^\/+/, "").replace(/^songs[\\/]+/, "");
  const songPath = `http://127.0.0.1:3000/songs/${cleanTrack}`;
  currentsong.src = songPath;

  if (!pause) {
    currentsong.load();
    currentsong.play()
      .then(() => { play.src = "paused.svg"; })
      .catch(err => console.error("Playback failed:", err));
  }

  document.querySelector(".songinfo").textContent = cleanTrack.replace(".mp3", "");
  document.querySelector(".songduration").textContent = "00:00";
};

async function main() {
  let songs = await getsongs();
  console.log("Songs loaded:", songs);
  playmusic(songs[0], true);

  let songul = document.querySelector(".Songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML += `
      <li>
        <img src="music.svg" alt="">
        <div class="info">
          <div class="songname">
            ${song.replaceAll("/songs/", " ").replaceAll("\\songs\\", " ")}
          </div>
          <div class="songArtist"> Ahmad Qadri </div>
        </div>
        <div class="playnow">
          <img src="play.svg" alt="">
        </div>
      </li>`;
  }

  //  Song list click (no double .mp3)
  Array.from(document.querySelector(".Songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      const clickedTrack = e.querySelector(".info").firstElementChild.innerHTML.trim();
      playmusic(clickedTrack);
    });
  });

  // Play/Pause button
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "paused.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });
  // Next button
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  //  Previous button
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);    if ((index - 1) >= 0) {
      playmusic(songs[index - 1]);
    }
  });


  // Time update function
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songduration").textContent =
      `${secondsToMinutes(currentsong.currentTime)} / ${secondsToMinutes(currentsong.duration)}`;
      document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
  });
}
// add an event to volume range input
document.querySelector(".range input[type='range']").addEventListener("input", (e) => {
  currentsong.volume = e.target.value / 100;
});
// add an event to volume image to mute/unmute
document.querySelector(".volume img").addEventListener("click", () => {
  if (currentsong.muted) {
    currentsong.muted = false;
    document.querySelector(".volume img").src = "volume.svg";
    document.querySelector(".range input[type='range']").value = currentsong.volume * 100;
  } else {
    currentsong.muted = true;
    document.querySelector(".volume img").src = "mute.svg";
    document.querySelector(".range input[type='range']").value = 0;
  }
});

document.querySelector(".seekbaar").addEventListener("click", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = (clickX / rect.width) * 100;
  document.querySelector(".circle").style.left = `${percent}%`;
  currentsong.currentTime = ((currentsong.duration) * percent) / 100;
});


main();



