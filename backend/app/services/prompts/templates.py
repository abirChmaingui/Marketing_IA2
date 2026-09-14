def build_user_prompt(
    *,
    content_type: str,
    product: str,
    audience: str,
    tone: str,
    language: str,
    additional_context: str = "",
) -> str:
    extra = f"\nContexte additionnel: {additional_context}" if additional_context.strip() else ""
    return (
        f"Type de contenu: {content_type}\n"
        f"Produit / service: {product}\n"
        f"Audience: {audience}\n"
        f"Ton: {tone}\n"
        f"Langue: {language}"
        f"{extra}\n"
        "Rédige le texte final, prêt à publier."
    )
