from fastapi import FastAPI


app = FastAPI(
    title="ASEM Global API",
    version="1.0"
)


@app.get("/")
def home():
    return {
        "name": "ASEM",
        "status": "online",
        "message": "ASEM Global Platform API"
    }
