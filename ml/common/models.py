import numpy as np

class EmpiricalPreprocessor:
    def __init__(self, feature_names):
        self.feature_names = feature_names
        self.continuous_cols = ["BMI", "MentHlth", "PhysHlth", "Age", "GenHlth"]
        self.means = {}
        self.stds = {}
        self.medians = {}

    def fit(self, X_arr):
        for idx, col in enumerate(self.feature_names):
            vals = X_arr[:, idx]
            self.medians[col] = float(np.median(vals))
            if col in self.continuous_cols:
                self.means[col] = float(np.mean(vals))
                s = float(np.std(vals))
                self.stds[col] = s if s > 1e-6 else 1.0
        return self

    def transform(self, X):
        if hasattr(X, "values"):
            X_mat = X.values.copy().astype(np.float32)
        elif isinstance(X, dict):
            X_mat = np.array([[float(X.get(c, self.medians.get(c, 0.0))) for c in self.feature_names]], dtype=np.float32)
        else:
            X_mat = np.array(X, dtype=np.float32).copy()
            if len(X_mat.shape) == 1:
                X_mat = X_mat.reshape(1, -1)

        for idx, col in enumerate(self.feature_names):
            if col in self.continuous_cols and col in self.means:
                X_mat[:, idx] = (X_mat[:, idx] - self.means[col]) / self.stds[col]
        return X_mat


class ClinicalScreeningModel:
    def __init__(self, disease, feature_names, weights, bias, base_prob, feature_importances):
        self.disease = disease
        self.feature_names = feature_names
        self.weights = np.array(weights, dtype=np.float32)
        self.bias = float(bias)
        self.base_prob = float(base_prob)
        self.feature_importances_ = np.array(feature_importances, dtype=np.float32)

    def predict_proba(self, X):
        if hasattr(X, "values"):
            X_arr = X.values.astype(np.float32)
        else:
            X_arr = np.array(X, dtype=np.float32)
        if len(X_arr.shape) == 1:
            X_arr = X_arr.reshape(1, -1)
            
        z = np.dot(X_arr, self.weights) + self.bias
        p1 = 1.0 / (1.0 + np.exp(-np.clip(z, -10.0, 10.0)))
        p0 = 1.0 - p1
        return np.column_stack([p0, p1])

    def predict(self, X):
        probs = self.predict_proba(X)[:, 1]
        return (probs >= 0.5).astype(int)


class ClinicalShapExplainer:
    def __init__(self, model, feature_means):
        self.model = model
        self.feature_means = np.array(feature_means, dtype=np.float32)
        self.expected_value = float(model.base_prob)

    def shap_values(self, X):
        if hasattr(X, "values"):
            X_arr = X.values.astype(np.float32)
        else:
            X_arr = np.array(X, dtype=np.float32)
        if len(X_arr.shape) == 1:
            X_arr = X_arr.reshape(1, -1)
            
        diff = X_arr - self.feature_means
        contributions = diff * self.model.weights
        return [ -contributions, contributions ]
