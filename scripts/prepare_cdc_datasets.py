import os
import json
import pandas as pd
import numpy as np
from ucimlrepo import fetch_ucirepo

os.makedirs(r"e:\diagnotech\datasets\diabetes", exist_ok=True)
os.makedirs(r"e:\diagnotech\datasets\cardiovascular", exist_ok=True)

print("Fetching CDC BRFSS dataset from cache...")
cdc_data = fetch_ucirepo(id=891)
X = cdc_data.data.features.copy()
y = cdc_data.data.targets.copy()

df_all = pd.concat([X, y], axis=1)
print(f"Total CDC dataset size: {df_all.shape}")

# 1. Diabetes Dataset
# Target: Diabetes_binary
# Features selection: HighBP, HighChol, CholCheck, BMI, Smoker, Stroke, HeartDiseaseorAttack, PhysActivity, Fruits, Veggies, HvyAlcoholConsump, GenHlth, MentHlth, PhysHlth, DiffWalk, Sex, Age
diabetes_features = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies", 
    "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth", 
    "DiffWalk", "Sex", "Age"
]
diabetes_cols = diabetes_features + ["Diabetes_binary"]
df_diabetes = df_all[diabetes_cols].dropna()

# Create balanced/stratified working sample of 45,000 rows (15,000 positive, 30,000 negative)
pos_diab = df_diabetes[df_diabetes["Diabetes_binary"] == 1]
neg_diab = df_diabetes[df_diabetes["Diabetes_binary"] == 0]
sample_pos = pos_diab.sample(n=min(15000, len(pos_diab)), random_state=42)
sample_neg = neg_diab.sample(n=min(30000, len(neg_diab)), random_state=42)
df_diabetes_sample = pd.concat([sample_pos, sample_neg]).sample(frac=1.0, random_state=42).reset_index(drop=True)

diabetes_csv_path = r"e:\diagnotech\datasets\diabetes\cdc_diabetes.csv"
df_diabetes_sample.to_csv(diabetes_csv_path, index=False)
print(f"Saved CDC Diabetes dataset: {df_diabetes_sample.shape}")

diabetes_meta = {
    "name": "CDC BRFSS Diabetes Health Indicators",
    "version": "1.0",
    "target": "Diabetes_binary",
    "task": "binary_classification",
    "total_survey_samples": len(df_all),
    "sample_count": len(df_diabetes_sample),
    "feature_count": len(diabetes_features),
    "positive_samples": int((df_diabetes_sample["Diabetes_binary"] == 1).sum()),
    "negative_samples": int((df_diabetes_sample["Diabetes_binary"] == 0).sum()),
    "source": "Centers for Disease Control and Prevention (CDC) - Behavioral Risk Factor Surveillance System (BRFSS)",
    "license": "Public Domain (U.S. Government)",
    "features": [
        {"name": "HighBP", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "High blood pressure diagnosed by doctor"},
        {"name": "HighChol", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "High cholesterol diagnosed by doctor"},
        {"name": "CholCheck", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Cholesterol check within the past 5 years"},
        {"name": "BMI", "type": "float", "unit": "kg/m²", "min": 12.0, "max": 65.0, "description": "Body Mass Index"},
        {"name": "Smoker", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Have smoked at least 100 cigarettes in life"},
        {"name": "Stroke", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "History of stroke"},
        {"name": "HeartDiseaseorAttack", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "History of coronary heart disease (CHD) or myocardial infarction (MI)"},
        {"name": "PhysActivity", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Physical activity in past 30 days not including job"},
        {"name": "Fruits", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Consume fruit 1 or more times per day"},
        {"name": "Veggies", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Consume vegetables 1 or more times per day"},
        {"name": "HvyAlcoholConsump", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Heavy drinkers (adult men >= 14 drinks/week, women >= 7 drinks/week)"},
        {"name": "GenHlth", "type": "integer", "unit": "1=Excellent, 2=Very Good, 3=Good, 4=Fair, 5=Poor", "min": 1, "max": 5, "description": "General health self-assessment"},
        {"name": "MentHlth", "type": "integer", "unit": "days (0-30)", "min": 0, "max": 30, "description": "Days of poor mental health in past 30 days"},
        {"name": "PhysHlth", "type": "integer", "unit": "days (0-30)", "min": 0, "max": 30, "description": "Days of poor physical health in past 30 days"},
        {"name": "DiffWalk", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Serious difficulty walking or climbing stairs"},
        {"name": "Sex", "type": "integer", "unit": "0=Female, 1=Male", "min": 0, "max": 1, "description": "Biological sex"},
        {"name": "Age", "type": "integer", "unit": "Category 1-13", "min": 1, "max": 13, "description": "13-level age category (1: 18-24, 2: 25-29, 3: 30-34, 4: 35-39, 5: 40-44, 6: 45-49, 7: 50-54, 8: 55-59, 9: 60-64, 10: 65-69, 11: 70-74, 12: 75-79, 13: 80+)"}
    ]
}
with open(r"e:\diagnotech\datasets\diabetes\metadata.json", "w") as f:
    json.dump(diabetes_meta, f, indent=2)

# 2. Cardiovascular Disease Dataset
# Target: HeartDiseaseorAttack
# Features: HighBP, HighChol, CholCheck, BMI, Smoker, Stroke, Diabetes_binary, PhysActivity, Fruits, Veggies, HvyAlcoholConsump, GenHlth, MentHlth, PhysHlth, DiffWalk, Sex, Age
cvd_features = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke", 
    "Diabetes_binary", "PhysActivity", "Fruits", "Veggies", 
    "HvyAlcoholConsump", "GenHlth", "MentHlth", "PhysHlth", 
    "DiffWalk", "Sex", "Age"
]
cvd_cols = cvd_features + ["HeartDiseaseorAttack"]
df_cvd = df_all[cvd_cols].dropna()

pos_cvd = df_cvd[df_cvd["HeartDiseaseorAttack"] == 1]
neg_cvd = df_cvd[df_cvd["HeartDiseaseorAttack"] == 0]
sample_pos_cvd = pos_cvd.sample(n=min(15000, len(pos_cvd)), random_state=42)
sample_neg_cvd = neg_cvd.sample(n=min(30000, len(neg_cvd)), random_state=42)
df_cvd_sample = pd.concat([sample_pos_cvd, sample_neg_cvd]).sample(frac=1.0, random_state=42).reset_index(drop=True)

cvd_csv_path = r"e:\diagnotech\datasets\cardiovascular\cdc_cvd.csv"
df_cvd_sample.to_csv(cvd_csv_path, index=False)
print(f"Saved CDC CVD dataset: {df_cvd_sample.shape}")

cvd_meta = {
    "name": "CDC BRFSS Cardiovascular Disease Indicators",
    "version": "1.0",
    "target": "HeartDiseaseorAttack",
    "task": "binary_classification",
    "total_survey_samples": len(df_all),
    "sample_count": len(df_cvd_sample),
    "feature_count": len(cvd_features),
    "positive_samples": int((df_cvd_sample["HeartDiseaseorAttack"] == 1).sum()),
    "negative_samples": int((df_cvd_sample["HeartDiseaseorAttack"] == 0).sum()),
    "source": "Centers for Disease Control and Prevention (CDC) - Behavioral Risk Factor Surveillance System (BRFSS)",
    "license": "Public Domain (U.S. Government)",
    "features": [
        {"name": "HighBP", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "High blood pressure diagnosed by doctor"},
        {"name": "HighChol", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "High cholesterol diagnosed by doctor"},
        {"name": "CholCheck", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Cholesterol check within the past 5 years"},
        {"name": "BMI", "type": "float", "unit": "kg/m²", "min": 12.0, "max": 65.0, "description": "Body Mass Index"},
        {"name": "Smoker", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Have smoked at least 100 cigarettes in life"},
        {"name": "Stroke", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "History of stroke"},
        {"name": "Diabetes_binary", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Diabetes or prediabetes diagnosis"},
        {"name": "PhysActivity", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Physical activity in past 30 days not including job"},
        {"name": "Fruits", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Consume fruit 1 or more times per day"},
        {"name": "Veggies", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Consume vegetables 1 or more times per day"},
        {"name": "HvyAlcoholConsump", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Heavy drinkers (adult men >= 14 drinks/week, women >= 7 drinks/week)"},
        {"name": "GenHlth", "type": "integer", "unit": "1=Excellent, 2=Very Good, 3=Good, 4=Fair, 5=Poor", "min": 1, "max": 5, "description": "General health self-assessment"},
        {"name": "MentHlth", "type": "integer", "unit": "days (0-30)", "min": 0, "max": 30, "description": "Days of poor mental health in past 30 days"},
        {"name": "PhysHlth", "type": "integer", "unit": "days (0-30)", "min": 0, "max": 30, "description": "Days of poor physical health in past 30 days"},
        {"name": "DiffWalk", "type": "integer", "unit": "0=No, 1=Yes", "min": 0, "max": 1, "description": "Serious difficulty walking or climbing stairs"},
        {"name": "Sex", "type": "integer", "unit": "0=Female, 1=Male", "min": 0, "max": 1, "description": "Biological sex"},
        {"name": "Age", "type": "integer", "unit": "Category 1-13", "min": 1, "max": 13, "description": "13-level age category (1: 18-24, 2: 25-29, 3: 30-34, 4: 35-39, 5: 40-44, 6: 45-49, 7: 50-54, 8: 55-59, 9: 60-64, 10: 65-69, 11: 70-74, 12: 75-79, 13: 80+)"}
    ]
}
with open(r"e:\diagnotech\datasets\cardiovascular\metadata.json", "w") as f:
    json.dump(cvd_meta, f, indent=2)

print("CDC Dataset preparation successful for both Diabetes and CVD!")
