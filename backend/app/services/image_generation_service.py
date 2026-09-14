from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.models import new_oid, oid_str, utc_now
from app.providers.image.factory import get_image_provider
from app.schemas.image import ImageGenerateBody
from app.services.prompts.image_prompt import build_image_prompt


async def generate_marketing_image(
    db: AsyncIOMotorDatabase,
    user_id: str,
    body: ImageGenerateBody,
    references: list[UploadFile],
) -> dict:
    settings = get_settings()
    prompt = build_image_prompt(body)
    provider = get_image_provider()
    urls = await provider.generate(prompt=prompt, size=body.size, model=body.model, mode=body.mode)
    created = utc_now()
    doc = {
        "_id": new_oid(),
        "user_id": user_id,
        "type": "image",
        "title": (body.description[:80] + "…") if len(body.description) > 80 else body.description,
        "content": None,
        "image_urls": urls,
        "prompt": prompt,
        "params": {
            **body.model_dump(),
            "reference_count": len(references),
        },
        "provider": settings.image_provider,
        "status": "completed",
        "created_at": created,
    }
    await db.generations.insert_one(doc)
    return {
        "id": oid_str(doc["_id"]),
        "prompt": prompt,
        "image_urls": urls,
        "provider": settings.image_provider,
        "created_at": created.isoformat(),
    }
