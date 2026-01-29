"""Analysis engine utilities for converting GameData analyzers from TypeScript to Python.

Provides a lightweight GameDataAnalyzer wrapper and an analyze_data helper that
mirrors the behavior of the TypeScript `AnalyzeData` function.
"""
from typing import Callable, Any, List, Dict


class GameDataAnalyzer:
    """Wrapper that holds an analyzer function and a trial combination function.

    analyzer: Callable[[dict], Any] -- a function that extracts a value from a single trial
    trial_combination: Callable[[List[Any], Dict[str, Any]], None] -- a function that
        merges the list of analyzer results into the analyzed_data structure.
    """

    def __init__(self, analyzer: Callable[[dict], Any], trial_combination: Callable[[List[Any], Dict[str, Any]], None]):
        self.analyzer = analyzer
        self.trial_combination = trial_combination


def analyze_data(unique_trials: List[dict], analysis_functions: List[GameDataAnalyzer], analyzed_data: Dict[str, Any]) -> Dict[str, Any]:
    """Run all analysis functions over the provided trials and update analyzed_data.

    Args:
        unique_trials: list of scraped trial dictionaries
        analysis_functions: list of GameDataAnalyzer instances
        analyzed_data: an existing analyzed data dict that will be updated

    Returns:
        The updated analyzed_data dict (same object passed in).
    """
    for analysis_fn in analysis_functions:
        trial_data = [analysis_fn.analyzer(trial) for trial in unique_trials]
        analysis_fn.trial_combination(trial_data, analyzed_data)

    return analyzed_data
