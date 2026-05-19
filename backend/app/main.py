from fastapi import FastAPI

from app.routes.songs import router as songs_router

app = FastAPI(title="Kairo API", version="0.1.0")

app.include_router(songs_router)


@app.get("/")
def read_root():
    return {"message": "Kairo backend is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "kairo-backend"}
