#!/bin/bash
# macOS: double-click to start a local server and open the game (close this window to stop).
cd "$(dirname "$0")"
( sleep 1; open "http://localhost:8000/index.html" ) &
python3 -m http.server 8000
