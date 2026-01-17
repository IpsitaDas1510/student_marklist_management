# Starts the API server and initializes the database

from http.server import ThreadingHTTPServer
from router import StudentRouter
from database.connection import init_database
import os


def main():
    init_database()
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("", port), StudentRouter)
    print(f"🚀 Server running at http://localhost:{port}")
    server.serve_forever()

if __name__ == "__main__":
    main()