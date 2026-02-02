# Spotyfyclone

 A lightweight Spotify-like front-end demo built with HTML, CSS and Vanilla JavaScript (built: Nov 2026).

## Overview

 Spotyfyclone is a small, client-side web app that reproduces core parts of the Spotify listening experience: login screen, library, player view, playback controls, and playlist-style song organization. It's intended as a frontend demo to show UI/UX skills and handling of audio playback in the browser.

## Features

- Play / Pause / Next / Previous controls
- Library view with song list and simple search
- Custom audio player UI with progress bar and time display
- Keyboard and click event support for playback controls
- Responsive layout for desktop and mobile
- Easy to add local audio files (see Usage)

## Tech Stack

- HTML (semantic markup)
- CSS (responsive styles split across `style.css` and `player.css`)
- Vanilla JavaScript (`player.js`, `script.js`) for event-driven UI and playback

## Project Structure

 Basic repo layout (top-level):

- `index.html` — main entry / landing
- `login.html` — login screen
- `library.html` — library / songs listing
- `player.html` — player view
- `style.css`, `player.css`, `utility.css` — styles
- `script.js`, `player.js` — JavaScript logic
- `songs/` — place your audio files here

## Usage (Local)

1. Clone or download the repository.
2. Place your audio files (e.g., `.mp3`) into the `songs/` folder.
3. Open `index.html` in a browser (double-click or use a local static server).

Quick local server (optional, recommended for consistent audio behavior):

```bash
 # from the project root
 python -m http.server 8000
 # then open http://localhost:8000 in your browser
```

## Code Notes

- The audio playback logic is in `player.js` and uses the HTMLAudio API. UI and DOM interactions are handled from `script.js`.
- CSS is organized so player-specific rules live in `player.css` while global styles are in `style.css`.
- Files and functions are intentionally small and modular to make the project easy to read and extend.

## What I learned

- Working with the HTMLAudio API and synchronizing UI state with playback
- Designing a responsive audio player and handling interaction edge cases
- Organizing vanilla JS for maintainability in a single-page-ish frontend

## Contributing

 Feel free to open issues or send pull requests. Suggested improvements:

- Add playlist saving/loading (localStorage)
- Improve accessibility (ARIA roles, keyboard traps)
- Add animated transitions to the player UI

## License

 Choose a license or leave blank; add your preferred license file here (e.g., `LICENSE`).

---

 If you'd like, I can also:

- add a short demo GIF or screenshots to the README
- add a MIT license and a simple `package.json` for tooling
- prepare a one-line GitHub description and topics/tags

 Tell me which of these you'd like next.
