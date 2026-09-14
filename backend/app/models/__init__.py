from datetime import datetime, timezone
from typing import Any

from bson import ObjectId


def oid_str(value: Any) -> str:
    return str(value)


def new_oid() -> ObjectId:
    return ObjectId()


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def user_to_public(doc: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": oid_str(doc["_id"]),
        "email": doc["email"],
        "name": doc.get("name", ""),
        "role": doc.get("role", "marketer"),
        "department": doc.get("department", "Marketing"),
        "avatar": doc.get("avatar"),
    }
