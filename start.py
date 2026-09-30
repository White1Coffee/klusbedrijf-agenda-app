"""Open the offline KBM & LW agenda in the default browser on localhost."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket
import sys
import threading
import webbrowser

HOST = "127.0.0.1"
PORT = 8765


class QuietHandler(SimpleHTTPRequestHandler):
    """Serve only the bundled static app without a noisy console log."""
    def log_message(self, _format: str, *_args: object) -> None:
        pass


def main() -> None:
    bundle_root = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    web_root = bundle_root / "www"
    if not (web_root / "index.html").is_file():
        raise SystemExit("De map www/index.html ontbreekt.")

    address = (HOST, PORT)
    with socket.socket() as probe:
        if probe.connect_ex(address) == 0:
            webbrowser.open_new_tab(f"http://{HOST}:{PORT}/")
            return

    handler = partial(QuietHandler, directory=str(web_root))
    server = ThreadingHTTPServer(address, handler)
    threading.Timer(0.6, lambda: webbrowser.open_new_tab(f"http://{HOST}:{PORT}/")).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
