import socket
socket.gethostname = lambda: "localhost"
socket.getfqdn = lambda *args: "localhost"
socket.gethostbyname = lambda *args: "127.0.0.1"

import time
t0 = time.time()
print("Importing pandas...", flush=True)
import pandas as pd
print(f"Pandas imported in {time.time()-t0:.2f}s!", flush=True)

print("Importing sklearn...", flush=True)
import sklearn
print(f"sklearn imported in {time.time()-t0:.2f}s!", flush=True)

print("Importing xgboost...", flush=True)
import xgboost
print(f"xgboost imported in {time.time()-t0:.2f}s!", flush=True)

print("SUCCESS!", flush=True)
