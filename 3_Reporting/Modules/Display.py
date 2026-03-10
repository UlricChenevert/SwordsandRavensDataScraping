from collections import defaultdict
from typing import Dict, List, Protocol

import matplotlib.pyplot as plt
import numpy as np

from Contracts.ExtractionContracts import ScrapedGameEntry
from Configuration.Colors import ALL_FACTIONS, FACTION_COLORS, TRACKS


class _PlotAxes(Protocol):
    def bar(self, x: Any, height: Any, width: Any = ..., **kwargs: Any) -> Any: ...
    def plot(self, *args: Any, **kwargs: Any) -> Any: ...
    def set_title(self, label: str, **kwargs: Any) -> Any: ...
    def set_xlabel(self, xlabel: str, **kwargs: Any) -> Any: ...
    def set_ylabel(self, ylabel: str, **kwargs: Any) -> Any: ...
    def set_xticks(self, ticks: Any, labels: Any = ..., **kwargs: Any) -> Any: ...
    def set_xticklabels(self, labels: Any, **kwargs: Any) -> Any: ...
    def legend(self, **kwargs: Any) -> Any: ...

def display_all(games: List[ScrapedGameEntry]) -> None:
    n_games = len(games)

    fig, axes = plt.subplots(2, 4, figsize=(22, 11), squeeze=False)
    fig.suptitle(
        f"Game of Thrones Board Game — Scraped Data Summary  (n = {n_games} games)",
        fontsize=14, fontweight="bold",
    )

    for col, track in enumerate(TRACKS):
        _plot_bid_by_position(axes[0, col], games, track)
    axes[0, 3].set_visible(False)

    for ax in axes[1]:
        ax.set_visible(False)

    plt.tight_layout()
    plt.show(block=True)


def _plot_bid_by_position(ax: _PlotAxes, games: List[ScrapedGameEntry], track: str) -> None:
    """Bar chart: mean bid amount per track position, aggregated across all events."""
    # position_amounts[position] = [amounts...]
    position_amounts: Dict[int, List[int]] = defaultdict(list)
    n_events = 0

    for game in games:
        # Group bids within this game by refIndex to find position ordering
        events: Dict[int, List[int]] = defaultdict(list)
        for bid in game["TrackBids"]:
            if bid["Track"] != track:
                continue
            events[bid["currentGameStateReferenceIndex"]].append(bid["Amount"])

        for amounts in events.values():
            n_events += 1
            for pos, amount in enumerate(sorted(amounts, reverse=True), start=1):
                position_amounts[pos].append(amount)

    positions = list(range(1, 9))
    x = np.arange(len(positions))
    means: list[float] = [float(np.mean(position_amounts[pos])) if position_amounts[pos] else 0.0 for pos in positions]

    ax.bar(x, means, 0.6, color="steelblue", alpha=0.85, edgecolor="white", linewidth=0.4)
    ax.set_title(f"{track}  (n = {n_events} bid events)")
    ax.set_xlabel("Track Position")
    ax.set_ylabel("Power Tokens Bid (mean)")
    ax.set_xticks(x)
    ax.set_xticklabels([f"#{p}" for p in positions])

