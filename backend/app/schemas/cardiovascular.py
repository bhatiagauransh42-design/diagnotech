from pydantic import BaseModel, Field

class CardiovascularInput(BaseModel):
    HighBP: int = Field(..., ge=0, le=1, description="High blood pressure diagnosed by doctor (0=No, 1=Yes)")
    HighChol: int = Field(..., ge=0, le=1, description="High cholesterol diagnosed by doctor (0=No, 1=Yes)")
    CholCheck: int = Field(..., ge=0, le=1, description="Cholesterol check within the past 5 years (0=No, 1=Yes)")
    BMI: float = Field(..., ge=10.0, le=80.0, description="Body Mass Index (kg/m²)")
    Smoker: int = Field(..., ge=0, le=1, description="Smoked at least 100 cigarettes in life (0=No, 1=Yes)")
    Stroke: int = Field(..., ge=0, le=1, description="History of stroke (0=No, 1=Yes)")
    Diabetes_binary: int = Field(..., ge=0, le=1, description="Diabetes or prediabetes diagnosis (0=No, 1=Yes)")
    PhysActivity: int = Field(..., ge=0, le=1, description="Physical activity in past 30 days (0=No, 1=Yes)")
    Fruits: int = Field(..., ge=0, le=1, description="Consume fruit 1+ times/day (0=No, 1=Yes)")
    Veggies: int = Field(..., ge=0, le=1, description="Consume vegetables 1+ times/day (0=No, 1=Yes)")
    HvyAlcoholConsump: int = Field(..., ge=0, le=1, description="Heavy alcohol consumption (0=No, 1=Yes)")
    GenHlth: int = Field(..., ge=1, le=5, description="General health rating (1=Excellent, 2=Very Good, 3=Good, 4=Fair, 5=Poor)")
    MentHlth: int = Field(..., ge=0, le=30, description="Days of poor mental health in past 30 days (0-30)")
    PhysHlth: int = Field(..., ge=0, le=30, description="Days of poor physical health in past 30 days (0-30)")
    DiffWalk: int = Field(..., ge=0, le=1, description="Serious difficulty walking or climbing stairs (0=No, 1=Yes)")
    Sex: int = Field(..., ge=0, le=1, description="Biological sex (0=Female, 1=Male)")
    Age: int = Field(..., ge=1, le=13, description="13-level age category (1: 18-24 ... 13: 80+)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "HighBP": 1,
                "HighChol": 1,
                "CholCheck": 1,
                "BMI": 31.2,
                "Smoker": 1,
                "Stroke": 0,
                "Diabetes_binary": 1,
                "PhysActivity": 0,
                "Fruits": 0,
                "Veggies": 1,
                "HvyAlcoholConsump": 0,
                "GenHlth": 4,
                "MentHlth": 5,
                "PhysHlth": 10,
                "DiffWalk": 1,
                "Sex": 1,
                "Age": 10
            }
        }
    }
