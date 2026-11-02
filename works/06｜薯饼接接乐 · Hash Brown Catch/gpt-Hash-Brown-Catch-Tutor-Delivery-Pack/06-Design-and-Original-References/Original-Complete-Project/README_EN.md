# Hash Brown Catch — Complete Project Bundle

Extract the entire ZIP first. On macOS run `Start-Game-Mac.command`; on Windows run `Start-Game-Windows.bat`.
Alternatively run `python3 Launch-Game.py` (macOS/Linux) or `py -3 Launch-Game.py` (Windows). Python 3 is required; the launcher uses only the standard library.
Keep the terminal open. The browser opens automatically; stop the server with Ctrl+C.
Use the printed local URL if port 8000 is occupied. You can also serve the `Game-and-Website` folder with VS Code Live Server.
Serve the game over HTTP rather than opening index.html directly. The runtime dependencies, backgrounds and font are included locally.

## Contents

- `Game-and-Website/`: complete playable site, source, assets, licenses, two rule-check scripts, and the earlier standalone source ZIP.
- `Game-and-Website/_reel/`: editable staged feature-demo recorder and timeline. After launching the game, open `/_reel/capture.html` at the same local origin.
- `Video-and-Audio/`: the 36-second 1920×1080 / 30fps MP4, original music/SFX WAV, audio generator and storyboard contact sheet.
- `UI-and-IP-Concepts/`: all five original UI / character concept boards and alternative visual directions.
- `UI-Development-Previews/`: earlier development screenshots; the playable website is the current implementation.
- `MANIFEST_SHA256.json`: file sizes and checksums.

The game synthesizes its own sound effects through Web Audio and draws its sprites in code. The MP4 uses an original synthesized score and effects.
The video source is HTML/JavaScript, not an After Effects or Premiere project. The capture page exports IVF or WebM; combine it with the included WAV using FFmpeg for MP4 export.
To regenerate the WAV, install NumPy and run `Video-and-Audio/make_audio.py`.

Wallet, unlocks and records are browser/origin-specific localStorage data and are not included as personal save files. No account credentials are included.
The capture page uses a separate demo-save key. The game does not need an API key or external media service.

Online version: https://hash-brown-crunch-club.wry-toast-5992.chatgpt.site
The hosted version currently requires authorized ChatGPT sign-in. The local bundle runs independently.

Source snapshot: 45cdce8e80ec3dc591b526bb27396b5b1906c634
Bundled on 2026-11-01. Design direction: Crystal Chen. Implementation and demo production assisted by ChatGPT.
