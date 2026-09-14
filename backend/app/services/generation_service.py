from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.models import new_oid, oid_str, utc_now
from app.providers.factory import get_text_provider
from app.schemas import TextGenerateRequest
from app.services.compliance import scan_compliance
from app.services.prompts.banking_system import banking_system_prompt
from app.services.prompts.templates import build_user_prompt


async def generate_marketing_text(
    db: AsyncIOMotorDatabase,
    user_id: str,
    body: TextGenerateRequest,
) -> dict:
    settings = get_settings()
    system = banking_system_prompt(body.language)
    user_prompt = build_user_prompt(
        content_type=body.type,
        product=body.product,
        audience=body.audience,
        tone=body.tone,
        language=body.language,
        additional_context=body.additional_context,
    )
    provider = get_text_provider()
    content = await provider.generate(
        system=system,
        user=user_prompt,
        language=body.language,
        tone=body.tone,
        content_type=body.type,
        product=body.product,
        audience=body.audience,
    )
    flags = scan_compliance(content)
    created = utc_now()
    doc = {
        "_id": new_oid(),
        "user_id": user_id,
        "type": "text",
        "title": f"{body.type} — {body.product}",
        "content": content,
        "image_urls": [],
        "prompt": user_prompt,
        "params": body.model_dump(),
        "compliance_flags": flags,
        "provider": settings.text_provider,
        "status": "completed",
        "created_at": created,
    }
    await db.generations.insert_one(doc)
    return {
        "id": oid_str(doc["_id"]),
        "content": content,
        "compliance_flags": flags,
        "provider": settings.text_provider,
        "created_at": created.isoformat(),
    }
