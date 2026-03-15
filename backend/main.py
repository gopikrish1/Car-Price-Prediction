from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import CarPriceModel

app = FastAPI(title="Car Price Prediction API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

car_model = CarPriceModel()


# ──── Schemas ────

class PredictionRequest(BaseModel):
    brand: str
    body_type: str
    segment: str
    year: int
    month: int
    mileage_k: float
    engine_vol: float
    fuel_type: str
    transmission: str
    condition: str
    owners: int
    reg_type: str
    fuel_efficiency: float
    max_power: float
    seats: int


# ──── Routes ────

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "3.0", "records": len(car_model.df)}


@app.get("/api/options")
def get_options():
    return car_model.get_options()


@app.get("/api/data")
def get_data():
    return car_model.get_dataset()


@app.get("/api/stats")
def get_stats():
    return car_model.get_stats()


@app.get("/api/brands")
def get_brands():
    return car_model.get_brand_data()


@app.get("/api/body-types")
def get_body_types():
    return car_model.get_body_data()


@app.get("/api/segments")
def get_segments():
    return car_model.get_segment_data()


@app.get("/api/scatter/{feature}")
def get_scatter(feature: str):
    return car_model.get_scatter_data(feature)


@app.post("/api/predict")
def predict(req: PredictionRequest):
    result = car_model.predict(
        brand=req.brand,
        body_type=req.body_type,
        segment=req.segment,
        year=req.year,
        month=req.month,
        mileage_k=req.mileage_k,
        engine_vol=req.engine_vol,
        fuel_type=req.fuel_type,
        transmission=req.transmission,
        condition=req.condition,
        owners=req.owners,
        reg_type=req.reg_type,
        fuel_efficiency=req.fuel_efficiency,
        max_power=req.max_power,
        seats=req.seats,
    )
    return {
        "predicted_price": result['price'],
        "price_range": {"low": result['price_low'], "high": result['price_high']},
        "currency": "INR",
        "train_accuracy": car_model.train_score,
        "cv_accuracy": car_model.cv_score,
    }
