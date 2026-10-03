import os, sys, time
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

log_path = r"e:\diagnotech\step.log"
with open(log_path, "w") as f:
    f.write(f"1. Started at {time.time()}\n")
    f.flush()

with open(log_path, "a") as f:
    f.write("2. Importing numpy\n")
    f.flush()
import numpy as np

with open(log_path, "a") as f:
    f.write("3. Importing pandas\n")
    f.flush()
import pandas as pd

with open(log_path, "a") as f:
    f.write("4. Importing sklearn\n")
    f.flush()
import sklearn

with open(log_path, "a") as f:
    f.write("5. Importing xgboost\n")
    f.flush()
import xgboost

with open(log_path, "a") as f:
    f.write("6. Importing shap\n")
    f.flush()
import shap

with open(log_path, "a") as f:
    f.write("7. ALL IMPORTS SUCCEEDED!\n")
    f.flush()
