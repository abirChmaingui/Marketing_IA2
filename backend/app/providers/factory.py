from app.core.config import get_settings
from app.providers.base import TextProvider
from app.providers.text.anthropic import AnthropicTextProvider
from app.providers.text.mock import MockTextProvider
from app.providers.text.ollama import OllamaTextProvider


def get_text_provider() -> TextProvider:
    settings = get_settings()
    if settings.text_provider == "anthropic":
        return AnthropicTextProvider()
    if settings.text_provider == "ollama":
        return OllamaTextProvider()
    return MockTextProvider()
