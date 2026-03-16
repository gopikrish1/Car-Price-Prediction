"""
FastAPI entry point – AutoValuate API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.predict import router as predict_router
from routes.dataset import router as dataset_router
from routes.visualize import router as visualize_router

app = FastAPI(title="AutoValuate API", version="1.0.0")

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(predict_router, prefix="/predict", tags=["predict"])
app.include_router(dataset_router, prefix="/dataset", tags=["dataset"])
app.include_router(visualize_router, prefix="/visualize", tags=["visualize"])


# ── Health check ──
@app.get("/")
def health():
    return {"status": "running", "message": "AutoValuate API is live."}
