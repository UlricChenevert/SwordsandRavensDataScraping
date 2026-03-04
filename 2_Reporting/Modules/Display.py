from collections import defaultdict
from typing import Any, Dict, List, Protocol, Tuple, cast

import matplotlib.pyplot as plt
import numpy as np

from Contracts.ExtractionContracts import ExtractedRoundData, ScrapedGameEntry
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

    _plot_faction_stat(axes[1, 0], games, "SupplyTier",    "Supply Tier by Round")
    _plot_faction_stat(axes[1, 1], games, "PowerTokens",   "Power Tokens by Round")
    _plot_faction_stat(axes[1, 2], games, "CastleCount",   "Castles by Round")
    _plot_faction_stat(axes[1, 3], games, "LandAreaCount", "Land Areas by Round")

    plt.tight_layout()
    plt.show(block=True)


def _plot_bid_by_position(ax: _PlotAxes, games: List[ScrapedGameEntry], track: str) -> None:
    """Bar chart: mean bid amount per track position, grouped by round."""
    # round_position_amounts[round_num][position] = [amounts...]
    round_position_amounts: Dict[int, Dict[int, List[int]]] = defaultdict(lambda: defaultdict(list))
    n_events = 0

    for game in games:
        # Group bids within this game by (round, refIndex) to find position ordering
        events: Dict[Tuple[int, int], List[int]] = defaultdict(list)
        for bid in game["TrackBids"]:
            if bid["Track"] != track:
                continue
            key = (bid["Round"], bid["currentGameStateReferenceIndex"])
            events[key].append(bid["Amount"])

        for (round_num, _), amounts in events.items():
            n_events += 1
            for pos, amount in enumerate(sorted(amounts, reverse=True), start=1):
                round_position_amounts[round_num][pos].append(amount)

    sorted_rounds = sorted(round_position_amounts)
    positions = list(range(1, 9))
    x = np.arange(len(positions))
    width = 0.75 / max(len(sorted_rounds), 1)
    colors = plt.cm.plasma(np.linspace(0.15, 0.85, max(len(sorted_rounds), 1)))  # type: ignore[attr-defined]

    for i, round_num in enumerate(sorted_rounds):
        data = round_position_amounts[round_num]
        means: list[float] = [float(np.mean(data[pos])) if data[pos] else 0.0 for pos in positions]
        offset = (i - len(sorted_rounds) / 2 + 0.5) * width
        ax.bar(x + offset, means, width, label=f"Round {round_num}",
               color=colors[i], alpha=0.85, edgecolor="white", linewidth=0.4)

    ax.set_title(f"{track}  (n = {n_events} bid events)")
    ax.set_xlabel("Track Position")
    ax.set_ylabel("Power Tokens Bid (mean)")
    ax.set_xticks(x)
    ax.set_xticklabels([f"#{p}" for p in positions])
    ax.legend(fontsize=7, ncol=2)

def _plot_faction_stat(ax: _PlotAxes, games: List[ScrapedGameEntry], field: str, title: str) -> None:
    """Line chart: mean stat value per round per faction, averaged across games."""
    # faction_round_values[faction][round_num] = [values...]
    faction_round_values: Dict[str, Dict[int, List[float]]] = defaultdict(lambda: defaultdict(list))

    for game in games:
        # Take the last log entry for each round (end-of-round state)
        last_per_round: Dict[int, ExtractedRoundData] = {}
        for entry in game["Rounds"]:
            last_per_round[entry["Round"]] = entry

        for round_num, entry in last_per_round.items():
            for faction, snapshot in entry["HouseSnapshotData"].items():
                value = cast(Dict[str, Any], snapshot).get(field)
                if value is not None:
                    faction_round_values[faction][round_num].append(float(value))

    all_rounds = sorted({r for rd in faction_round_values.values() for r in rd})

    for faction in ALL_FACTIONS:
        if faction not in faction_round_values:
            continue
        data = faction_round_values[faction]
        rounds = sorted(data)
        means = [np.mean(data[r]) for r in rounds]
        ax.plot(rounds, means, label=faction, color=FACTION_COLORS[faction],
                linewidth=1.8, marker="o", markersize=3)

    ax.set_title(f"{title}  (n = {len(games)} games)")
    ax.set_xlabel("Round")
    ax.set_ylabel(field)
    if all_rounds:
        ax.set_xticks(all_rounds)
    ax.legend(fontsize=7, ncol=2)
