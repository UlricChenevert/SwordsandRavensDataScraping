from collections import defaultdict
from typing import Any, Dict, List, Protocol, cast

import matplotlib.pyplot as plt
import numpy as np

from Contracts.ExtractionContracts import ExtractedRoundData, ScrapedGameEntry
from Configuration.Colors import ALL_FACTIONS, FACTION_COLORS, TRACKS


class _PlotAxes(Protocol):
    def bar(self, x: Any, height: Any, width: Any = ..., **kwargs: Any) -> Any: ...
    def plot(self, *args: Any, **kwargs: Any) -> Any: ...
    def errorbar(self, x: Any, y: Any, **kwargs: Any) -> Any: ...
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

    _plot_faction_stat(axes[1, 0], games, "SupplyTier",         "Supply Tier by Round")
    _plot_faction_stat(axes[1, 1], games, "PowerTokens",        "Power Tokens by Round")
    _plot_faction_stat(axes[1, 2], games, "RoundEndCastleCount","Castles by Round")
    _plot_faction_stat(axes[1, 3], games, "LandAreaCount",      "Land Areas by Round")

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
    stds: list[float] = [float(np.std(position_amounts[pos])) if len(position_amounts[pos]) > 1 else 0.0 for pos in positions]

    # Clip lower error arm so bars never go below 0
    yerr_lower = [min(s, m) for m, s in zip(means, stds)]
    ax.bar(x, means, 0.6, color="steelblue", alpha=0.85, edgecolor="white", linewidth=0.4,
           yerr=[yerr_lower, stds], capsize=4,
           error_kw={"elinewidth": 1.2, "ecolor": "black", "alpha": 0.6})
    ax.set_title(f"{track}  (n = {n_events} bid events)")
    ax.set_xlabel("Track Position")
    ax.set_ylabel("Power Tokens Bid (mean ± 1 SD)")
    ax.set_xticks(x)
    ax.set_xticklabels([f"#{p}" for p in positions])


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
        means = [float(np.mean(data[r])) for r in rounds]
        stds = [float(np.std(data[r])) if len(data[r]) > 1 else 0.0 for r in rounds]
        color = FACTION_COLORS[faction]
        ax.errorbar(
            rounds, means,
            yerr=stds,
            label=faction, color=color,
            linewidth=1.8, marker="o", markersize=3,
            capsize=3, capthick=1.0, elinewidth=0.8, alpha=0.85,
        )

    ax.set_title(f"{title}  (n = {len(games)} games)")
    ax.set_xlabel("Round")
    ax.set_ylabel(field)
    if all_rounds:
        ax.set_xticks(all_rounds)
    ax.legend(fontsize=7, ncol=2)
