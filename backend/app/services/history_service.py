from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models import oid_str


def _to_item(doc: dict) -> dict:
    created = doc.get("created_at")
    return {
        "id": oid_str(doc["_id"]),
        "type": doc.get("type", "text"),
        "title": doc.get("title", "Génération"),
        "content": doc.get("content"),
        "image_urls": doc.get("image_urls", []),
        "prompt": doc.get("prompt"),
        "params": doc.get("params", {}),
        "created_at": created.isoformat() if hasattr(created, "isoformat") else str(created or ""),
        "status": doc.get("status", "completed"),
    }


async def list_history(db: AsyncIOMotorDatabase, user_id: str, limit: int = 50) -> list[dict]:
    cursor = db.generations.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    return [_to_item(doc) async for doc in cursor]


async def get_history_item(db: AsyncIOMotorDatabase, user_id: str, item_id: str) -> dict | None:
    try:
        oid = ObjectId(item_id)
    except InvalidId:
        return None
    doc = await db.generations.find_one({"_id": oid, "user_id": user_id})
    return _to_item(doc) if doc else None
