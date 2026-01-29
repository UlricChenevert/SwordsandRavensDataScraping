import asyncio
from itertools import groupby
import math
from typing import List, Dict, Any
import matplotlib.pyplot as plt
from functools import partial

from Scripts.AnalysisScript.Python.LoadData import load_analyzed_data
from Scripts.Contracts.ExtractionContracts import (
    IRON_THRONE_BID_CHART,
    FIEFDOM_BID_CHART,
    KINGS_COURT_BID_CHART,
    ProbablyDistribution,
    extractBidAnalysis,
)

async def main() -> None:
    rawJson = await load_analyzed_data()
    bidData = extractBidAnalysis(rawJson)

    

    displayFunctions = [
        partial(displayBidChart, bidData['iron_throne_bid_chart']),
        partial(displayBidChart, bidData['kings_court_bid_chart']),
        partial(displayBidChart, bidData['fiefdom_bid_chart'])
    ]

    MAX_COLUMNS = 3
    ROWS = math.ceil(displayFunctions.__len__() / MAX_COLUMNS)

    fig, axes = plt.subplots(ROWS, MAX_COLUMNS, squeeze=False)

    flattenAxes = axes.flatten()

    for index, displayFunction in enumerate(displayFunctions): 
        displayFunction(flattenAxes[index])

    # ax.set_xlabel("Timestamp")
    # ax.set_ylabel("Province Count")
    # ax.set_title("Province Count by Faction Over Time")
    plt.show(block=True)

def displayBidChart(chart: List[List[ProbablyDistribution]], subplot):
    lines = []
    lineLabels = []

    for index, series  in enumerate(chart):
        xValues = list(map(lambda x: x['rank'], series))
        yValues = list(map(lambda x: x['probability'], series))

        line = subplot.plot(xValues, yValues)
        lines.append(line[0])
        lineLabels.append("Round " + str(index))

    subplot.legend(lines, lineLabels)

if __name__ == "__main__":
    asyncio.run(main())