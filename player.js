document.addEventListener("DOMContentLoaded", async function () {
  const audioPlayer = document.getElementById("audio-player");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const songImage = document.getElementById("song-image");
  const playBtn = document.getElementById("play");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("previous");
  const circle = document.querySelector(".circle");
  const seekbar = document.querySelector(".seekbaar");
  const durationDisplay = document.querySelector(".songduration");

  const urlParams = new URLSearchParams(window.location.search);
  const songIndexFromUrl = parseInt(urlParams.get("songIndex") || "0", 10);
  const initialImg = decodeURIComponent(urlParams.get("img") || "");
  const initialTitle = decodeURIComponent(urlParams.get("title") || "");
  const initialArtist = decodeURIComponent(urlParams.get("artist") || "");

  let songMetadata = [];
  let currentIndex = 0;

  function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  async function getSongMetadata() {
    try {
      const response = await fetch("index.html");
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const templates = doc.querySelectorAll(".template");

      // Auto-generate song names as song1, song2, song3...
      return Array.from(templates).map((template, index) => ({
        song: `song${index + 1}.mp3`,
        img: template.dataset.img,
        title: template.dataset.title,
        artist: template.dataset.artist,
      }));
    } catch (error) {
      console.error("Failed to fetch song metadata:", error);
      return [];
    }
  }

  const playMusic = (songPath, shouldPlay = true) => {
    if (!songPath) return console.error("Song path not found!");

    const fullSongUrl = `http://127.0.0.1:3000/songs/${songPath}`;
    audioPlayer.src = fullSongUrl;

    if (shouldPlay) {
      audioPlayer.play().catch(e => console.error("Playback failed:", e));
      playBtn.src = "paused.svg";
    } else {
      playBtn.src = "play.svg";
    }
  };

  const updatePlayerUI = (songInfo) => {
    if (!songInfo) return;
    songImage.src = songInfo.img;
    songTitle.textContent = songInfo.title;
    songArtist.textContent = songInfo.artist;
  };

  async function main() {
    songMetadata = await getSongMetadata();
    if (songMetadata.length === 0) {
      console.error("No song metadata found. Player cannot operate.");
      return;
    }

    currentIndex = songIndexFromUrl;
    const initialSong = songMetadata[currentIndex];
    updatePlayerUI({ img: initialImg, title: initialTitle, artist: initialArtist });
    playMusic(initialSong.song, false);

    playBtn.addEventListener("click", () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.src = "paused.svg";
      } else {
        audioPlayer.pause();
        playBtn.src = "play.svg";
      }
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % songMetadata.length;
      const nextSong = songMetadata[currentIndex];
      updatePlayerUI(nextSong);
      playMusic(nextSong.song);
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + songMetadata.length) % songMetadata.length;
      const prevSong = songMetadata[currentIndex];
      updatePlayerUI(prevSong);
      playMusic(prevSong.song);
    });

    audioPlayer.addEventListener("timeupdate", () => {
      if (!isNaN(audioPlayer.duration)) {
        durationDisplay.textContent =
          `${secondsToMinutes(audioPlayer.currentTime)} / ${secondsToMinutes(audioPlayer.duration)}`;
        circle.style.left = (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
      }
    });

    seekbar.addEventListener("click", (e) => {
      const percent = e.offsetX / e.currentTarget.getBoundingClientRect().width;
      audioPlayer.currentTime = percent * audioPlayer.duration;
    });
  }

  main();
});
