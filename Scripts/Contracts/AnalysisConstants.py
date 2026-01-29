"""Analysis constants converted from TypeScript.

Provides the AnalyzedKeys enum used as keys in analyzed-data structures.
"""
from enum import Enum


class AnalyzedKeys(str, Enum):
    """Keys used in analyzed output structures.

    Matches values from the TypeScript enum in `AnalysisConstants.ts`.
    """

    CardChoices = "Card Choices"
    MiliaryFactionStatistics = "Miliary Faction Statistics"


__all__ = ["AnalyzedKeys"]
