import httpx

from app.core.config import get_settings
from app.core.exceptions import ProviderError
from app.providers.base import TextProvider


class OllamaTextProvider(TextProvider):
    name = "ollama"

    async def generate(self, *, system: str, user: str, **kwargs) -> str:
        settings = get_settings()
        payload = {
            "model": settings.ollama_model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        try:
            async with httpx.AsyncClient(timeout=settings.llm_timeout_seconds) as client:
                response = await client.post(
                    f"{settings.ollama_base_url.rstrip('/')}/api/chat",
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except Exception as exc:
            raise ProviderError(f"Ollama: {exc}") from exc
        return (data.get("message") or {}).get("content", "").strip() or "Réponse vide d'Ollama."
