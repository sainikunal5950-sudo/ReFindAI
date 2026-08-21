from pydantic import BaseModel, Field
from typing import List, Optional

class TextSimilarityRequest(BaseModel):
    text1: str = Field(..., description="First text to compare", min_length=1)
    text2: str = Field(..., description="Second text to compare", min_length=1)

class TextSimilarityResponse(BaseModel):
    similarity_score: float = Field(..., description="Cosine similarity score scaled 0 to 100")
    raw_cosine: float = Field(..., description="Raw cosine similarity score (-1 to 1)")
    algorithm: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")
    text1_length: int
    text2_length: int

class TextEmbeddingRequest(BaseModel):
    text: str = Field(..., description="Text to compute vector embedding for", min_length=1)

class TextEmbeddingResponse(BaseModel):
    dimensions: int
    embedding: List[float]
    model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")

class ImageSimilarityResponse(BaseModel):
    similarity_score: float
    algorithm: str
    message: str
