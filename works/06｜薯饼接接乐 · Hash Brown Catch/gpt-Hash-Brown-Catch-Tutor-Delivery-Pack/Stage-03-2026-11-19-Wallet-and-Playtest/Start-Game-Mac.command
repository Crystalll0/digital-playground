#!/bin/bash
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  exec python3 Launch-Game.py
else
  echo "Python 3 is required. Install Python 3, or use VS Code Live Server on Game-and-Website."
  read -r -p "Press Return to close."
fi
