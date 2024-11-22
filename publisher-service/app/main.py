from fastapi import FastAPI
from app.controllers.positions_controller import router as positions_router

app = FastAPI(
    title="Vehicle Positions Publisher",
    version="1.0.0",
    root_path="/publisher"
)
app.include_router(positions_router)

@app.get("/health")
async def health_check():
    return {"status": "OK"}

