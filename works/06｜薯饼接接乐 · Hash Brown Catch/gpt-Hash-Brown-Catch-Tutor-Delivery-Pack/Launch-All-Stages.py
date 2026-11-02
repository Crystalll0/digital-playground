#!/usr/bin/env python3
"""Start the bundled game with Python's standard-library local web server."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser

root = Path(__file__).resolve().parent
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
for port in range(8000, 8011):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), handler)
        break
    except OSError:
        continue
else:
    raise SystemExit('Ports 8000-8010 are busy. Close another local server and try again.')
url = f'http://localhost:{server.server_port}/'
print('Hash Brown Catch is ready: ' + url)
print('Keep this window open. Press Ctrl+C to stop the server.')
threading.Timer(.4, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('Breakfast is closed. Stay golden!')
finally:
    server.server_close()
