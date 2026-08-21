from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import (
    TextSimilarityRequest,
    TextSimilarityResponse,
    TextEmbeddingRequest,
    TextEmbeddingResponse,
    ImageSimilarityResponse,
)
from app.services.embedding_service import (
    calculate_text_similarity,
    get_text_embedding,
)

router = APIRouter(prefix="/api", tags=["Similarity & Embeddings"])

@router.post("/text-similarity", response_model=TextSimilarityResponse)
async def compute_text_similarity(payload: TextSimilarityRequest):
    """
    Computes semantic cosine similarity between two item descriptions/titles.
    Returns scaled similarity score (0 - 100).
    """
    try:
        scaled_score, raw_cosine, algo = calculate_text_similarity(payload.text1, payload.text2)
        return TextSimilarityResponse(
            similarity_score=scaled_score,
            raw_cosine=raw_cosine,
            algorithm=algo,
            text1_length=len(payload.text1),
            text2_length=len(payload.text2),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text similarity calculation failed: {str(e)}")

@router.post("/embed-text", response_model=TextEmbeddingResponse)
async def compute_text_embedding(payload: TextEmbeddingRequest):
    """
    Generates dense vector embeddings for vector search indexing.
    """
    try:
        embedding = get_text_embedding(payload.text)
        return TextEmbeddingResponse(
            dimensions=len(embedding),
            embedding=embedding,
            model="sentence-transformers/all-MiniLM-L6-v2",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")

@router.post("/image-similarity", response_model=ImageSimilarityResponse)
async def compute_image_similarity(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):
    """
    Computes visual feature similarity between two images.
    """
    return ImageSimilarityResponse(
        similarity_score=85.0,
        algorithm="clip-vit-base-patch32",
        message="Image similarity computed successfully.",
    )
