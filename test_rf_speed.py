import time
t0 = time.time()
print("1. Importing numpy and joblib...", flush=True)
import numpy as np
import joblib

t1 = time.time()
print("2. Importing RandomForestClassifier...", flush=True)
from sklearn.ensemble import RandomForestClassifier
print(f"   -> RandomForestClassifier imported in {time.time()-t1:.2f}s!", flush=True)

t2 = time.time()
print("3. Fitting dummy RandomForest...", flush=True)
X = np.random.randn(100, 17).astype(np.float32)
y = np.random.randint(0, 2, size=100)
rf = RandomForestClassifier(n_estimators=10, max_depth=4, random_state=42)
rf.fit(X, y)
prob = rf.predict_proba(X[:2])
print(f"   -> RF fitted in {time.time()-t2:.2f}s, prob shape: {prob.shape}!", flush=True)

print(f"=== ALL PASSED in {time.time()-t0:.2f}s ===", flush=True)
