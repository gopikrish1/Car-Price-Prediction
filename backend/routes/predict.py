"""
POST /predict  —  predict the resale price of a used car.
"""

import os
import joblib
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()

VALID_MODELS = {"linear_regression", "decision_tree", "random_forest"}
SAVED_DIR = os.path.join(os.path.dirname(__file__), "..", "saved_models")

# Feature order MUST match FEATURE_COLS in preprocess.py
FEATURE_ORDER = [
    "engine_size", "horsepower", "width",
    "drive_wheels", "fuel_type", "make", "curb_weight",
    "body_style", "num_of_cylinders", "city_mpg", "highway_mpg",
]


class PredictRequest(BaseModel):
    engine_size: float = Field(..., ge=60, le=330)
    horsepower: float = Field(..., ge=50, le=300)
    width: float = Field(..., ge=60, le=75)
    curb_weight: float = Field(..., ge=1500, le=4500)
    drive_wheels: int = Field(..., ge=0, le=2)
    fuel_type: int = Field(..., ge=0, le=1)
    make: int = Field(..., ge=0, le=22)
    body_style: int = Field(..., ge=0, le=4)
    num_of_cylinders: int = Field(..., ge=2, le=12)
    city_mpg: float = Field(..., ge=10, le=60)
    highway_mpg: float = Field(..., ge=10, le=60)
    model_name: str


@router.post("/")
def predict(req: PredictRequest):
    if req.model_name not in VALID_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid model_name '{req.model_name}'. "
                   f"Must be one of: {', '.join(sorted(VALID_MODELS))}",
        )

    pkl_path = os.path.join(SAVED_DIR, f"{req.model_name}.pkl")
    if not os.path.exists(pkl_path):
        raise HTTPException(
            status_code=404,
            detail=f"Model file '{req.model_name}.pkl' not found. "
                   "Please run train.py first.",
        )

    model = joblib.load(pkl_path)

    features = np.array([[
        req.engine_size,
        req.horsepower,
        req.width,
        req.drive_wheels,
        req.fuel_type,
        req.make,
        req.curb_weight,
        req.body_style,
        req.num_of_cylinders,
        req.city_mpg,
        req.highway_mpg,
    ]])

    predicted = float(model.predict(features)[0])

    return {
        "predicted_price": round(predicted, 2),
        "model_used": req.model_name,
        "currency": "USD",
    }
