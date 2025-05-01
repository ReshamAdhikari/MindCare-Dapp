from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import pandas as pd
import joblib

# Load model and scaler
try:
    model = joblib.load("best_mental_health_model.joblib")
    scaler = joblib.load("mental_health_scaler.joblib")
except Exception as e:
    raise RuntimeError(f"Failed to load model or scaler: {e}")

app = FastAPI(title="MindCare Mental Health API")

# ✅ NEW: CORS setup to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SurveyInput(BaseModel):
    Age: int
    Gender: int
    family_history: int
    work_interfere: int
    no_employees: int
    leave: int
    mental_health_consequence: int
    phys_health_consequence: int
    supervisor: int
    mental_vs_physical: int
    obs_consequence: int

@app.post("/predict")
def predict_mental_health(data: SurveyInput):
    try:
        input_data = pd.DataFrame([data.dict()])
        scaled_features = scaler.transform(input_data)
        prediction = model.predict(scaled_features)[0]
        return {
            "prediction": int(prediction),
            "message": "High Risk of Mental Health Issues" if prediction == 1 else "Low Risk / Stable"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
