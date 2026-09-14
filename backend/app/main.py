from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging
from app.db.indexes import ensure_indexes
from app.db.mongodb import close_mongo_connection, connect_to_mongo, get_database
from app.routers import auth, history, image, text
from app.services.auth_service import seed_demo_user


@asynccontextmanager
async def lifespan(_app: FastAPI):
    settings = get_settings()
    setup_logging(settings.debug)
    await connect_to_mongo()
    db = get_database()
    await ensure_indexes(db)
    await seed_demo_user(db)
    yield
    await close_mongo_connection()


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_exception_handlers(application)
    application.include_router(auth.router)
    application.include_router(text.router)
    application.include_router(image.router)
    application.include_router(history.router)

    @application.get("/health")
    async def health():
        return {"status": "ok"}

    return application


app = create_app()
