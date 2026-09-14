from abc import ABC, abstractmethod


class TextProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def generate(self, *, system: str, user: str, **kwargs) -> str:
        raise NotImplementedError
