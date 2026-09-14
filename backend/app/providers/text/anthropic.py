import httpx

from app.core.config import get_settings
from app.core.exceptions import ProviderError
from app.providers.base import TextProvider


class AnthropicTextProvider(TextProvider):
    name = "anthropic"

    async def generate(self, *, system: str, user: str, **kwargs) -> str:
        settings = get_settings()
        if not settings.anthropic_api_key:
            raise ProviderError("ANTHROPIC_API_KEY manquante")
        headers = {
            "x-api-key": settings.anthropic_api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": settings.anthropic_model,
            "max_tokens": settings.default_max_tokens,
            "temperature": settings.default_temperature,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        }
        try:
            async with httpx.AsyncClient(timeout=settings.llm_timeout_seconds) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except Exception as exc:
            raise ProviderError(f"Anthropic: {exc}") from exc
        parts = data.get("content") or []
        texts = [p.get("text", "") for p in parts if p.get("type") == "text"]
        return "\n".join(texts).strip() or "Réponse vide du fournisseur."
