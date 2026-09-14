from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.logging import get_logger

logger = get_logger(__name__)


async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index("email", unique=True)
    await db.generations.create_index([("user_id", 1), ("created_at", -1)])
    await db.generations.create_index("type")
    logger.info("Index MongoDB assurés (users, generations)")
