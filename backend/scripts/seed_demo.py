from app.core.security import hash_password
from app.models import new_oid, utc_now


async def seed_demo_user(db) -> None:
    email = "demo@banque.fr"
    existing = await db.users.find_one({"email": email})
    if existing:
        return
    await db.users.insert_one(
        {
            "_id": new_oid(),
            "email": email,
            "name": "Demo Marketing",
            "password_hash": hash_password("demo1234"),
            "role": "marketer",
            "department": "Marketing",
            "avatar": None,
            "created_at": utc_now(),
        }
    )
