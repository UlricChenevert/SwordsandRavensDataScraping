"""Utilities for loading and storing scraped and analyzed JSON data.

This is a straightforward Python port of the TypeScript `LoadAndStoreData.ts` file.
"""
import os
import json
import asyncio
from typing import List, Dict, Any


# Small synchronous helpers used by async wrappers
def _read_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _write_json(path: str, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)

DEFAULT_READ_DIRECTORY = "./ScrapedData/CollectedData/"
DEFAULT_WRITE_DIRECTORY = "./ScrapedData/AnalyzedData/"
ANALYZED_DATA_NAME = "AnalyzedData.json"


def remove_redundant_data(scraped_data: List[dict]) -> List[dict]:
    """Filter scraped_data so that each game id appears only once (first occurrence wins)."""
    game_id_set = set()
    final_data: List[dict] = []

    for file in scraped_data:
        # Each scraped file is expected to be a dict with a single top-level game id
        try:
            game_id : int = next(iter(file.keys()))
        except StopIteration:
            continue

        if game_id in game_id_set:
            continue

        game_id_set.add(game_id)
        final_data.append(file)

    return final_data


async def load_scrapped_data(amount: int = 1, directory: str = DEFAULT_READ_DIRECTORY) -> List[dict]:
    """Asynchronously load up to `amount` JSON files from the scraped-data directory.

    Uses asyncio.to_thread to perform blocking file I/O in threadpool without
    blocking the event loop.
    """
    try:
        files = sorted([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])
    except FileNotFoundError:
        return []

    if amount < 0:
        amount = len(files)

    files = files[:amount]

    tasks = [asyncio.to_thread(_read_json, os.path.join(directory, file_name)) for file_name in files]

    if not tasks:
        return []

    return await asyncio.gather(*tasks)


async def load_analyzed_data(directory: str = DEFAULT_WRITE_DIRECTORY) -> Dict[str, Any]:
    """Asynchronously load previously stored analyzed data or return an empty dict if none exists."""
    path = os.path.join(directory, ANALYZED_DATA_NAME)
    try:
        return await asyncio.to_thread(_read_json, path)
    except FileNotFoundError:
        return {}


async def store_data(data: Dict[str, Any], override: bool = True, directory: str = DEFAULT_WRITE_DIRECTORY) -> None:
    """Asynchronously store the analyzed data to the analysis directory.

    If `override` is True the directory will be cleared of files before writing.
    """
    os.makedirs(directory, exist_ok=True)

    if override:
        for file_name in os.listdir(directory):
            file_path = os.path.join(directory, file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)

    await asyncio.to_thread(_write_json, os.path.join(directory, ANALYZED_DATA_NAME), data)
