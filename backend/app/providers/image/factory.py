from app.core.config import get_settings
from app.providers.image.base import ImageProvider
from app.providers.image.mock import MockImageProvider
from app.providers.image.pollinations import PollinationsImageProvider


def get_image_provider() -> ImageProvider:
    settings = get_settings()
    if settings.image_provider == "mock":
        return MockImageProvider()
    return PollinationsImageProvider()
