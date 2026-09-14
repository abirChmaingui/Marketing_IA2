from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import create_access_token, hash_password, verify_password
from app.models import new_oid, user_to_public, utc_now
from app.schemas import RegisterRequest


async def seed_demo_user(db: AsyncIOMotorDatabase) -> None:
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


async def register_user(db: AsyncIOMotorDatabase, body: RegisterRequest) -> dict:
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise ValueError("Un compte existe déjà avec cet email")

    doc = {
        "_id": new_oid(),
        "email": body.email.lower(),
        "name": body.name.strip(),
        "password_hash": hash_password(body.password),
        "role": "marketer",
        "department": body.department.strip() or "Marketing",
        "avatar": None,
        "created_at": utc_now(),
    }
    await db.users.insert_one(doc)
    public = user_to_public(doc)
    token = create_access_token(public["id"], {"email": public["email"]})
    return {"access_token": token, "token_type": "bearer", "user": public}


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str) -> dict:
    doc = await db.users.find_one({"email": email.lower()})
    if not doc or not verify_password(password, doc.get("password_hash", "")):
        raise ValueError("Email ou mot de passe incorrect")
    public = user_to_public(doc)
    token = create_access_token(public["id"], {"email": public["email"]})
    return {"access_token": token, "token_type": "bearer", "user": public}
