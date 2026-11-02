@echo off
set PYTHONUTF8=1
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 Launch-Game.py
) else (
  python Launch-Game.py
)
pause
