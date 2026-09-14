from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.dependencies import get_current_user, get_db
from app.schemas.image import ImageGenerateBody, ImageGenerateResponse
from app.services.image_generation_service import generate_marketing_image

router = APIRouter(prefix="/generate/image", tags=["image"])

MAX_REFS = 10


@router.post("", response_model=ImageGenerateResponse)
async def generate_image(
    description: str = Form(...),
    mode: str = Form("text-to-image"),
    style: str = Form("photorealistic"),
    colors: str = Form(""),
    size: str = Form("square"),
    model: str = Form("flux"),
    extra_instructions: str = Form(""),
    reference_images: list[UploadFile] = File(default=[]),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    color_list = [c.strip() for c in colors.split(",") if c.strip()]
    refs = [f for f in reference_images if f.filename]
    if len(refs) > MAX_REFS:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_REFS} images de référence")

    try:
        body = ImageGenerateBody(
            description=description,
            mode=mode,  # type: ignore[arg-type]
            style=style,  # type: ignore[arg-type]
            colors=color_list,
            size=size,  # type: ignore[arg-type]
            model=model,  # type: ignore[arg-type]
            extra_instructions=extra_instructions,
        )
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return await generate_marketing_image(db, current_user["id"], body, refs)
