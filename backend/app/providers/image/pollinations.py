from urllib.parse import quote

from app.providers.image.base import ImageProvider

SIZE_MAP = {
    "square": (1024, 1024),
    "portrait": (768, 1024),
    "landscape": (1024, 768),
    "wide": (1280, 720),
}


class PollinationsImageProvider(ImageProvider):
    name = "pollinations"

    async def generate(self, *, prompt: str, size: str, model: str, mode: str) -> list[str]:
        width, height = SIZE_MAP.get(size, (1024, 1024))
        encoded = quote(prompt[:1500])
        model_name = "flux" if model in {"flux", "dalle3", "midjourney", "sdxl"} else "flux"
        url = (
            f"https://image.pollinations.ai/prompt/{encoded}"
            f"?width={width}&height={height}&model={model_name}&nologo=true&enhance=true"
        )
        return [url]


class MockImageProvider(ImageProvider):
    name = "mock"

    async def generate(self, *, prompt: str, size: str, model: str, mode: str) -> list[str]:
        width, height = SIZE_MAP.get(size, (1024, 1024))
        seed = abs(hash(prompt)) % 10_000
        return [f"https://picsum.photos/seed/{seed}/{width}/{height}"]
