from app.schemas.image import ImageGenerateBody

STYLE_HINTS = {
    "photorealistic": (
        "photorealistic photography, natural lighting, real human skin texture, "
        "no anime, no illustration, no cartoon"
    ),
    "illustration": "clean editorial illustration, professional banking campaign",
    "flat": "flat vector design, simple shapes, corporate brand style",
    "3d": "polished 3D render, studio lighting, product visualization",
    "cinematic": "cinematic photography, shallow depth of field, film grain",
    "watercolor": "soft watercolor illustration, elegant and premium",
}

SIZE_HINTS = {
    "square": "square composition 1:1",
    "portrait": "portrait composition 3:4",
    "landscape": "landscape composition 4:3",
    "wide": "wide cinematic composition 16:9",
}


def build_image_prompt(body: ImageGenerateBody) -> str:
    colors = ", ".join(body.colors) if body.colors else "bank brand navy, gold, white"
    extra = f" Additional direction: {body.extra_instructions}." if body.extra_instructions.strip() else ""
    style = STYLE_HINTS.get(body.style, body.style)
    size = SIZE_HINTS.get(body.size, body.size)
    mode_note = ""
    if body.mode == "image-to-image":
        mode_note = " Keep the composition inspired by the reference photos."
    elif body.mode == "editing":
        mode_note = " Edit the scene according to the brief while keeping brand consistency."
    return (
        f"Professional bank marketing visual. {body.description}. "
        f"Style: {style}. Color palette: {colors}. {size}. "
        f"Model preference: {body.model}.{mode_note}{extra} "
        "No logos of other banks, no unreadable text, no watermarks."
    )
