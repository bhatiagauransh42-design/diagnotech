import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

class CDCPreprocessor(BaseEstimator, TransformerMixin):
    """
    Standard preprocessor for CDC BRFSS health indicators.
    Applies median imputation for missing values and StandardScaler on numeric continuous features (BMI, MentHlth, PhysHlth, Age).
    Leaves binary categorical 0/1 indicators in clean numeric format.
    """
    def __init__(self, feature_names=None):
        self.feature_names = feature_names or []
        self.scaler = StandardScaler()
        self.continuous_cols = ["BMI", "MentHlth", "PhysHlth", "Age", "GenHlth"]
        self.fitted_ = False
        
    def fit(self, X, y=None):
        if isinstance(X, pd.DataFrame):
            self.feature_names = list(X.columns)
            X_mat = X.copy()
        else:
            X_mat = pd.DataFrame(X, columns=self.feature_names)
            
        cont_cols = [c for c in self.continuous_cols if c in self.feature_names]
        if cont_cols:
            self.scaler.fit(X_mat[cont_cols].fillna(X_mat[cont_cols].median()))
            
        self.medians_ = X_mat.median().to_dict()
        self.fitted_ = True
        return self
        
    def transform(self, X):
        if not self.fitted_:
            raise RuntimeError("CDCPreprocessor must be fitted before transforming.")
            
        if isinstance(X, pd.DataFrame):
            X_mat = X.copy()
        else:
            X_mat = pd.DataFrame(X, columns=self.feature_names)
            
        # Fill missing with fitted medians
        for col in self.feature_names:
            if col in X_mat.columns:
                X_mat[col] = X_mat[col].fillna(self.medians_.get(col, 0))
            else:
                X_mat[col] = self.medians_.get(col, 0)
                
        # Reorder to match exact feature order
        X_mat = X_mat[self.feature_names]
        
        # Scale continuous
        cont_cols = [c for c in self.continuous_cols if c in self.feature_names]
        if cont_cols:
            scaled_vals = self.scaler.transform(X_mat[cont_cols])
            X_mat[cont_cols] = scaled_vals
            
        return X_mat.values

    def get_feature_names_out(self, input_features=None):
        return np.array(self.feature_names)
