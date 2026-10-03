import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve, precision_recall_curve
)

def compute_all_metrics(y_true, y_pred, y_prob):
    """
    Computes all screening-oriented classification metrics:
    accuracy, precision, recall (sensitivity), specificity, f1, roc_auc, confusion matrix.
    """
    cm = confusion_matrix(y_true, y_pred)
    # cm layout:
    # [[TN, FP],
    #  [FN, TP]]
    tn, fp, fn, tp = cm.ravel()
    
    accuracy = float(accuracy_score(y_true, y_pred))
    precision = float(precision_score(y_true, y_pred, zero_division=0))
    recall = float(recall_score(y_true, y_pred, zero_division=0))
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    try:
        roc_auc = float(roc_auc_score(y_true, y_prob))
    except Exception:
        roc_auc = 0.5
        
    return {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "specificity": round(specificity, 4),
        "f1": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": {
            "true_positive": int(tp),
            "true_negative": int(tn),
            "false_positive": int(fp),
            "false_negative": int(fn)
        }
    }

def compute_curve_points(y_true, y_prob):
    """Generates simplified coordinates for ROC and Precision-Recall curves."""
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    precision, recall, _ = precision_recall_curve(y_true, y_prob)
    
    # Sample up to 25 points for smooth web rendering
    step_roc = max(1, len(fpr) // 25)
    roc_points = [{"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} for i in range(0, len(fpr), step_roc)]
    if roc_points[-1]["fpr"] != 1.0 or roc_points[-1]["tpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})
        
    step_pr = max(1, len(recall) // 25)
    pr_points = [{"recall": round(float(recall[i]), 3), "precision": round(float(precision[i]), 3)} for i in range(0, len(recall), step_pr)]
    
    return {
        "roc_curve": roc_points,
        "pr_curve": pr_points
    }
