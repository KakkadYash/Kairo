from fastapi import FastAPI

app = FastAPI(title="Kairo API", version="0.1.0")


@app.get("/")
def read_root():
    return {"message": "Kairo backend is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "kairo-backend"}
