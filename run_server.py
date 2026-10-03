import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn

if __name__ == "__main__":
    print("Starting Diagnotech FastAPI server on 0.0.0.0:8000 (accessible via http://localhost:8000 and http://127.0.0.1:8000)...", flush=True)
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, log_level="info")
