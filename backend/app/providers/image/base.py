from abc import ABC, abstractmethod


class ImageProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def generate(self, *, prompt: str, size: str, model: str, mode: str) -> list[str]:
        raise NotImplementedError
