import sys
import types
import time

t0 = time.time()

# Mock socket in sys.modules before any other imports
dummy = types.ModuleType("socket")
dummy.gethostname = lambda: "localhost"
dummy.getfqdn = lambda *a: "localhost"
dummy.gethostbyname = lambda *a: "127.0.0.1"
dummy.getaddrinfo = lambda *a, **k: []
dummy.AF_INET = 2
dummy.SOCK_STREAM = 1
sys.modules["socket"] = dummy

print("1. Importing pandas...", flush=True)
import pandas as pd
print(f"   ✓ Pandas imported in {time.time()-t0:.2f}s!", flush=True)

print("2. Importing sklearn...", flush=True)
import sklearn
print(f"   ✓ sklearn imported in {time.time()-t0:.2f}s!", flush=True)

print("3. Importing xgboost...", flush=True)
import xgboost
print(f"   ✓ xgboost imported in {time.time()-t0:.2f}s!", flush=True)

print("4. Importing shap...", flush=True)
import shap
print(f"   ✓ shap imported in {time.time()-t0:.2f}s!", flush=True)

print(f"=== ALL IMPORTED IN {time.time()-t0:.2f}s ===", flush=True)
