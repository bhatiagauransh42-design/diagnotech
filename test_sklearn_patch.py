import sys
import time

t0 = time.time()
print("0. Patching socket functions...", flush=True)
import socket
socket.gethostname = lambda: "localhost"
socket.getfqdn = lambda *a: "localhost"
socket.gethostbyname = lambda *a: "127.0.0.1"
socket.getaddrinfo = lambda *a, **k: [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('127.0.0.1', 80))]

t1 = time.time()
print("1. Importing numpy and joblib...", flush=True)
import numpy as np
import joblib
print(f"   -> numpy & joblib in {time.time()-t1:.2f}s!", flush=True)

t2 = time.time()
print("2. Importing RandomForestClassifier...", flush=True)
from sklearn.ensemble import RandomForestClassifier
print(f"   -> RandomForestClassifier in {time.time()-t2:.2f}s!", flush=True)

t3 = time.time()
print("3. Testing fitting...", flush=True)
X = np.random.randn(100, 17).astype(np.float32)
y = np.random.randint(0, 2, size=100)
rf = RandomForestClassifier(n_estimators=10, max_depth=4, random_state=42)
rf.fit(X, y)
prob = rf.predict_proba(X[:2])
print(f"   -> Fitted in {time.time()-t3:.2f}s, prob shape: {prob.shape}!", flush=True)

t4 = time.time()
print("4. Importing XGBoost...", flush=True)
from xgboost import XGBClassifier
xgb = XGBClassifier(n_estimators=10, max_depth=3, random_state=42)
xgb.fit(X, y)
prob_xgb = xgb.predict_proba(X[:2])
print(f"   -> XGBoost fitted in {time.time()-t4:.2f}s, prob: {prob_xgb.shape}!", flush=True)

t5 = time.time()
print("5. Testing SHAP...", flush=True)
import shap
exp = shap.TreeExplainer(rf)
vals = exp.shap_values(X[:10])
print(f"   -> SHAP TreeExplainer in {time.time()-t5:.2f}s!", flush=True)

print(f"=== COMPLETE ML STACK PASSED IN {time.time()-t0:.2f}s ===", flush=True)
