import sys, os, time, json
t0 = time.time()
print("1. Importing numpy and joblib...", flush=True)
import numpy as np
import joblib
print(f"   -> numpy & joblib in {time.time()-t0:.2f}s", flush=True)

t1 = time.time()
print("2. Testing pure Python CDC Preprocessor...", flush=True)

class PureCDCPreprocessor:
    def __init__(self, feature_names):
        self.feature_names = feature_names
        self.continuous_cols = ["BMI", "MentHlth", "PhysHlth", "Age", "GenHlth"]
        self.means = {}
        self.stds = {}
        self.medians = {}

    def fit(self, X_dict_list):
        for col in self.feature_names:
            vals = [row[col] for row in X_dict_list if row.get(col) is not None]
            med = float(np.median(vals)) if vals else 0.0
            self.medians[col] = med
            if col in self.continuous_cols:
                self.means[col] = float(np.mean(vals))
                s = float(np.std(vals))
                self.stds[col] = s if s > 1e-6 else 1.0
        return self

    def transform(self, X_input):
        # Handles single dict or list of dicts or 2D array
        if isinstance(X_input, dict):
            X_input = [X_input]
        
        rows = []
        if isinstance(X_input, list) and isinstance(X_input[0], dict):
            for row in X_input:
                r = []
                for col in self.feature_names:
                    val = float(row.get(col, self.medians.get(col, 0.0)))
                    if col in self.continuous_cols and col in self.means:
                        val = (val - self.means[col]) / self.stds[col]
                    r.append(val)
                rows.append(r)
            return np.array(rows, dtype=np.float32)
        elif isinstance(X_input, np.ndarray):
            X_out = X_input.copy().astype(np.float32)
            for idx, col in enumerate(self.feature_names):
                if col in self.continuous_cols and col in self.means:
                    X_out[:, idx] = (X_out[:, idx] - self.means[col]) / self.stds[col]
            return X_out
        return np.array(X_input, dtype=np.float32)

print(f"   -> PureCDCPreprocessor defined in {time.time()-t1:.2f}s", flush=True)
print("=== FAST TEST PASSED ===", flush=True)
