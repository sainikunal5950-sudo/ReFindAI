
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.routes.similarity_routes import router as similarity_router
from app.services.embedding_service import init_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("refind-ai-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize ML model
    logger.info("Initializing Retrivo AI Service...")
    init_model()
    yield
    # Shutdown
    logger.info("Shutting down Retrivo AI Service.")

app = FastAPI(
    title="Retrivo AI Similarity Microservice",
    description="High-performance text & image semantic matching engine using Sentence-Transformers and CLIP",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(similarity_router)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Retrivo AI Similarity Service",
        "model": "all-MiniLM-L6-v2",
        "version": "1.0.0",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
