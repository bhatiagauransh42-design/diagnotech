import os
import sys
import time
import csv

t0 = time.time()
print("1. Importing numpy...", flush=True)
import numpy as np
print(f"   -> numpy took {time.time()-t0:.2f}s", flush=True)

t1 = time.time()
print("2. Importing sklearn...", flush=True)
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score
print(f"   -> sklearn took {time.time()-t1:.2f}s", flush=True)

t2 = time.time()
print("3. Importing xgboost...", flush=True)
from xgboost import XGBClassifier
print(f"   -> xgboost took {time.time()-t2:.2f}s", flush=True)

t3 = time.time()
print("4. Importing shap...", flush=True)
import shap
print(f"   -> shap took {time.time()-t3:.2f}s", flush=True)

t4 = time.time()
print("5. Reading CSV with built-in csv module...", flush=True)
csv_path = r"e:\diagnotech\datasets\diabetes\cdc_diabetes.csv"
rows = []
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        rows.append([float(x) for x in r])
data = np.array(rows, dtype=np.float32)
print(f"   -> CSV read {data.shape} in {time.time()-t4:.2f}s!", flush=True)

print("6. Training small test Random Forest...", flush=True)
t5 = time.time()
X = data[:1000, 1:]
y = data[:1000, 0]
rf = RandomForestClassifier(n_estimators=10, max_depth=4, random_state=42)
rf.fit(X, y)
prob = rf.predict_proba(X)[:, 1]
print(f"   -> RF fit and predict took {time.time()-t5:.2f}s, roc_auc={roc_auc_score(y, prob):.4f}!", flush=True)

print(f"=== ALL COMPLETED SUCCESSFULLY in {time.time()-t0:.2f}s ===", flush=True)
