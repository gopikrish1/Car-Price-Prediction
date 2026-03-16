"""
Train three ML models on the UCI Automobile dataset, evaluate them,
and persist the .pkl files + metrics.json to backend/saved_models/.
Run once before starting the server:
    python -m models.train        (from the backend/ directory)
"""

import os
import sys
import json
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Allow running as standalone script
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from utils.preprocess import load_and_clean, FEATURE_COLS, TARGET_COL


def main():
    # ── 1. Load & preprocess ──
    df = load_and_clean()
    X = df[FEATURE_COLS].values
    y = df[TARGET_COL].values

    print(f"Dataset: {len(df)} rows, {len(FEATURE_COLS)} features")

    # ── 2. Train / test split (80/20) ──
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # ── 3. Define models ──
    models = {
        "linear_regression": LinearRegression(),
        "decision_tree": DecisionTreeRegressor(max_depth=8, random_state=42),
        "random_forest": RandomForestRegressor(
            n_estimators=100, random_state=42
        ),
    }

    # ── 4. Train, evaluate, save ──
    save_dir = os.path.join(os.path.dirname(__file__), "..", "saved_models")
    os.makedirs(save_dir, exist_ok=True)

    all_metrics = {}

    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        r2 = round(r2_score(y_test, preds), 4)
        mae = round(mean_absolute_error(y_test, preds), 2)
        rmse = round(float(np.sqrt(mean_squared_error(y_test, preds))), 2)

        all_metrics[name] = {"r2": r2, "mae": mae, "rmse": rmse}

        pkl_path = os.path.join(save_dir, f"{name}.pkl")
        joblib.dump(model, pkl_path)
        print(f"  {name:25s}  R²={r2:.4f}  MAE={mae:>10.2f}  RMSE={rmse:>10.2f}  → {pkl_path}")

    # ── 5. Save metrics ──
    metrics_path = os.path.join(save_dir, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\nMetrics saved to {metrics_path}")


if __name__ == "__main__":
    main()
