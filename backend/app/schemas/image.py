from typing import Literal

from pydantic import BaseModel, Field

ImageMode = Literal["text-to-image", "image-to-image", "editing"]
ImageStyle = Literal[
    "photorealistic",
    "illustration",
    "flat",
    "3d",
    "cinematic",
    "watercolor",
]
ImageSize = Literal["square", "portrait", "landscape", "wide"]
ImageModel = Literal["dalle3", "flux", "sdxl", "midjourney"]


class ImageGenerateBody(BaseModel):
    description: str = Field(..., min_length=3, max_length=4000)
    mode: ImageMode = "text-to-image"
    style: ImageStyle = "photorealistic"
    colors: list[str] = Field(default_factory=list)
    size: ImageSize = "square"
    model: ImageModel = "flux"
    extra_instructions: str = Field(default="", max_length=2000)


class ImageGenerateResponse(BaseModel):
    id: str
    prompt: str
    image_urls: list[str]
    provider: str
    created_at: str
