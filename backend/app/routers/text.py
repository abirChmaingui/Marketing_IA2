from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.dependencies import get_current_user, get_db
from app.schemas import TextGenerateRequest, TextGenerateResponse
from app.services.generation_service import generate_marketing_text

router = APIRouter(prefix="/generate/text", tags=["text"])


@router.post("", response_model=TextGenerateResponse)
async def generate_text(
    body: TextGenerateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await generate_marketing_text(db, current_user["id"], body)
