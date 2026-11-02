@echo off
REM Windows: double-click to start a local server and open the game (close this window to stop).
cd /d "%~dp0"
start "" http://localhost:8000/index.html
python -m http.server 8000
