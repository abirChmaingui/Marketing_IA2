from app.providers.base import TextProvider

TONES = {
    "Professionnel": {
        "fr": "formulation sobre et institutionnelle",
        "en": "sober institutional wording",
        "es": "redacción institucional sobria",
        "de": "sachliche institutionelle Formulierung",
    },
    "Commercial": {
        "fr": "accroche claire tournée vers l’action",
        "en": "clear call-to-action oriented copy",
        "es": "copy orientado a la acción",
        "de": "aktionsorientierter Werbetext",
    },
    "Convaincant": {
        "fr": "arguments bénéfices, preuves et réassurance",
        "en": "benefit-led arguments with reassurance",
        "es": "argumentos de beneficio y confianza",
        "de": "nutzenorientierte Argumente mit Sicherheit",
    },
    "Amical": {
        "fr": "ton chaleureux et accessible",
        "en": "warm and approachable tone",
        "es": "tono cercano y accesible",
        "de": "freundlicher und zugänglicher Ton",
    },
    "Informatif": {
        "fr": "faits, clarté, pédagogie",
        "en": "facts, clarity, educational tone",
        "es": "hechos, claridad y pedagogía",
        "de": "faktenbasiert, klar und erklärend",
    },
    "Inspirant": {
        "fr": "projection positive sans promesse financière",
        "en": "positive outlook without financial promises",
        "es": "proyección positiva sin promesas financieras",
        "de": "positive Haltung ohne Finanzversprechen",
    },
}


def _lang_key(language: str) -> str:
    value = (language or "").lower()
    if value.startswith("en") or "english" in value or "anglais" in value:
        return "en"
    if value.startswith("es") or "español" in value or "espagnol" in value:
        return "es"
    if value.startswith("de") or "deutsch" in value or "allemand" in value:
        return "de"
    return "fr"


class MockTextProvider(TextProvider):
    name = "mock"

    async def generate(self, *, system: str, user: str, **kwargs) -> str:
        language = kwargs.get("language") or "Français"
        tone = kwargs.get("tone") or "Professionnel"
        content_type = kwargs.get("content_type") or "contenu"
        product = kwargs.get("product") or "offre bancaire"
        audience = kwargs.get("audience") or "clients"
        lang = _lang_key(language)
        tone_hint = TONES.get(tone, TONES["Professionnel"]).get(lang, TONES["Professionnel"]["fr"])

        if lang == "en":
            return (
                f"{content_type} for {product}. Written for {audience} in a {tone.lower()} tone "
                f"({tone_hint}). This demo text is generated locally without a paid LLM. "
                "No guaranteed returns. Terms apply. Visit your branch or the app to learn more."
            )
        if lang == "es":
            return (
                f"{content_type} sobre {product}, dirigido a {audience}, tono {tone.lower()} "
                f"({tone_hint}). Texto de demostración generado localmente. "
                "Sin rentabilidad garantizada. Consulte condiciones en su agencia o en la app."
            )
        if lang == "de":
            return (
                f"{content_type} zu {product} für {audience}, Ton: {tone} ({tone_hint}). "
                "Lokaler Demo-Text ohne bezahltes LLM. Keine Renditegarantie. "
                "Details in der Filiale oder in der App."
            )
        return (
            f"{content_type} pour {product}, destiné à {audience}, ton {tone.lower()} "
            f"({tone_hint}). Texte de démonstration généré localement, sans LLM payant. "
            "Aucun rendement n’est garanti. Conditions en agence ou dans l’application."
        )
