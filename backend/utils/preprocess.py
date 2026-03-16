"""
Shared data-cleaning logic for the UCI Automobile dataset.
Used by both training (train.py) and prediction (predict route).
"""

import pandas as pd
import os

# ─── Fixed encoding maps (must be identical in training & prediction) ───

DRIVE_WHEELS_MAP = {"fwd": 0, "rwd": 1, "4wd": 2}

FUEL_TYPE_MAP = {"gas": 0, "diesel": 1}

BODY_STYLE_MAP = {
    "sedan": 0, "hatchback": 1, "wagon": 2,
    "hardtop": 3, "convertible": 4,
}

NUM_CYLINDERS_MAP = {
    "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "eight": 8, "twelve": 12,
}

MAKE_MAP = {
    "alfa-romero": 0, "audi": 1, "bmw": 2, "chevrolet": 3,
    "dodge": 4, "honda": 5, "isuzu": 6, "jaguar": 7,
    "mazda": 8, "mercedes-benz": 9, "mercury": 10,
    "mitsubishi": 11, "nissan": 12, "peugot": 13,
    "plymouth": 14, "porsche": 15, "renault": 16, "saab": 17,
    "subaru": 18, "toyota": 19, "volkswagen": 20, "volvo": 21,
}

FEATURE_COLS = [
    "engine-size", "horsepower", "width",
    "drive-wheels", "fuel-type", "make", "curb-weight",
    "body-style", "num-of-cylinders", "city-mpg", "highway-mpg",
]

TARGET_COL = "price"


def load_and_clean(csv_path: str | None = None) -> pd.DataFrame:
    """
    Load the raw CSV, replace '?' with NaN, drop rows where price is
    missing, convert numeric columns, impute medians, encode categoricals.
    Returns a clean DataFrame with FEATURE_COLS + TARGET_COL.
    """
    if csv_path is None:
        csv_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "car_dataset.csv"
        )

    df = pd.read_csv(csv_path)

    # Replace question marks with NaN
    df.replace("?", pd.NA, inplace=True)

    # Drop rows where price is missing
    df.dropna(subset=["price"], inplace=True)

    # Convert numeric columns
    numeric_cols = [
        "price", "horsepower", "engine-size", "width", "curb-weight",
        "city-mpg", "highway-mpg",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Fill NaN with column median for numeric cols
    for col in numeric_cols:
        median_val = df[col].median()
        df[col].fillna(median_val, inplace=True)

    # Encode categoricals using fixed maps
    df["drive-wheels"] = df["drive-wheels"].map(DRIVE_WHEELS_MAP).fillna(0).astype(int)
    df["fuel-type"] = df["fuel-type"].map(FUEL_TYPE_MAP).fillna(0).astype(int)
    df["make"] = df["make"].map(MAKE_MAP).fillna(0).astype(int)
    df["body-style"] = df["body-style"].map(BODY_STYLE_MAP).fillna(0).astype(int)
    df["num-of-cylinders"] = df["num-of-cylinders"].map(NUM_CYLINDERS_MAP).fillna(4).astype(int)

    return df[FEATURE_COLS + [TARGET_COL]]
