"""Entrypoint script that loads scraped data, runs analyzers, and stores results.

This mirrors the top-level logic in the TypeScript `AnalysisScript.ts` file.
"""
import asyncio
from typing import List, Dict, Any

from AnalysisEngine import GameDataAnalyzer, analyze_data
from LoadData import load_scrapped_data, remove_redundant_data, load_analyzed_data, store_data

# The TypeScript version imports specific analyzers from ConfiguredAnalyzers.ts.
# Per request we won't implement the configured analyzers here; if a
# `ConfiguredAnalyzers.py` module provides an `ANALYZERS` list (of
# GameDataAnalyzer instances), this script will use it. Otherwise it falls back
# to an empty list.
try:
    from ConfiguredAnalyzers import ANALYZERS  # type: ignore
except Exception:
    ANALYZERS: List[GameDataAnalyzer] = []


async def main() -> None:
    scraped = await load_scrapped_data()
    unique = remove_redundant_data(scraped)
    analyzed = await load_analyzed_data()

    result = analyze_data(unique, ANALYZERS, analyzed)

    await store_data(result)


if __name__ == "__main__":
    asyncio.run(main())