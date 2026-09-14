import re

RISKY_PATTERNS = [
    (r"\bgarantie[s]?\b", "garantie"),
    (r"\bsans risque\b", "sans risque"),
    (r"\brendement (garanti|assuré)\b", "rendement garanti"),
    (r"\bmeilleur[e]? du marché\b", "superlatif non sourcé"),
    (r"\b100\s?%\b", "affirmation 100%"),
]


def scan_compliance(text: str) -> list[str]:
    flags: list[str] = []
    lowered = text.lower()
    for pattern, label in RISKY_PATTERNS:
        if re.search(pattern, lowered, flags=re.IGNORECASE):
            flags.append(label)
    return flags
