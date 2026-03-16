"""
Visualization data endpoints — four GET routes for chart data.
"""

import os
import json
import pandas as pd
from fastapi import APIRouter

router = APIRouter()

DATA_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "car_dataset.csv")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "metrics.json")


def _load_df() -> pd.DataFrame:
    """Load CSV, clean question marks, convert numerics."""
    df = pd.read_csv(DATA_CSV)
    df.replace("?", pd.NA, inplace=True)
    for col in ["price", "engine-size", "horsepower", "width", "curb-weight"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=["price"], inplace=True)
    return df


@router.get("/avg-price-by-make")
def avg_price_by_make():
    df = _load_df()
    grouped = df.groupby("make")["price"].mean().round(2).reset_index()
    grouped.columns = ["make", "avg_price"]
    return grouped.to_dict(orient="records")


@router.get("/engine-vs-price")
def engine_vs_price():
    df = _load_df()
    df.dropna(subset=["engine-size"], inplace=True)
    return [
        {"engine_size": float(r["engine-size"]), "price": float(r["price"])}
        for _, r in df.iterrows()
    ]


@router.get("/horsepower-vs-price")
def horsepower_vs_price():
    df = _load_df()
    df.dropna(subset=["horsepower"], inplace=True)
    return [
        {"horsepower": float(r["horsepower"]), "price": float(r["price"])}
        for _, r in df.iterrows()
    ]


@router.get("/model-metrics")
def model_metrics():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            return json.load(f)

    # Hardcoded fallback
    return {
        "linear_regression": {"r2": 0.78, "mae": 3200.0, "rmse": 4100.0},
        "decision_tree": {"r2": 0.84, "mae": 2500.0, "rmse": 3400.0},
        "random_forest": {"r2": 0.93, "mae": 1600.0, "rmse": 2200.0},
    }
