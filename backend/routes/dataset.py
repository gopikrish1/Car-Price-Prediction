"""
GET /dataset  —  return raw (human-readable) dataset rows.
"""

import os
import json
import pandas as pd
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/")
def get_dataset():
    csv_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "car_dataset.csv"
    )
    df = pd.read_csv(csv_path)

    # Replace '?' with None for JSON
    df.replace("?", pd.NA, inplace=True)

    total = len(df)
    columns = df.columns.tolist()

    # Use pandas to_json which handles NaN → null properly, then parse back
    rows_json = df.head(100).to_json(orient="records")
    rows = json.loads(rows_json)

    return JSONResponse(content={
        "total": total,
        "columns": columns,
        "rows": rows,
    })
