from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.dependencies import get_current_user, get_db
from app.schemas import HistoryItem
from app.services.history_service import get_history_item, list_history

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryItem])
async def history_list(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await list_history(db, current_user["id"], limit)


@router.get("/{item_id}", response_model=HistoryItem)
async def history_detail(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    item = await get_history_item(db, current_user["id"], item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Élément introuvable")
    return item
