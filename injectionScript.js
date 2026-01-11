(() => {
  // InjectScript/Stats.ts
  var determineProbabilityMassDistribution = (dataArray, numberAccessor) => {
    const sampleSize = dataArray.length;
    if (sampleSize === 0) return {};
    const rawCounts = {};
    const distribution = {};
    dataArray.forEach((element) => {
      const number = numberAccessor(element);
      rawCounts[number] = (rawCounts[number] || 0) + 1;
    });
    for (const bidAmount in rawCounts) {
      distribution[bidAmount] = rawCounts[bidAmount] / sampleSize;
    }
    return distribution;
  };

  // InjectScript/ExtractGameData.ts
  var extractGameData = (logs) => {
    const logData = logs.map((log) => log.data);
    const bidsData = logData.filter(
      (log) => log.type == "clash-of-kings-bidding-done" && log.distributor === null
      // No Targs
    );
    const bids = [];
    bidsData.forEach((bidInstance) => {
      bidInstance.results.forEach((bidAmountInstance) => {
        bidAmountInstance[1].forEach((factionBidInstance) => {
          bids.push({
            "Track": tracksMapping[bidInstance.trackerI],
            "Amount": bidAmountInstance[0],
            "Faction": factionBidInstance
          });
        });
      });
    });
    const AverageBid = 0;
    const ironThroneData = bids.filter((bidData) => bidData.Track == "Iron Throne");
    const fiefdomData = bids.filter((bidData) => bidData.Track == "Fiefdom");
    const kingsCourtData = bids.filter((bidData) => bidData.Track == "King's Court");
    const bidDataAccessor = (element) => element.Amount;
    const ironThroneDistribution = determineProbabilityMassDistribution(ironThroneData, bidDataAccessor);
    const fiefdomDistribution = determineProbabilityMassDistribution(fiefdomData, bidDataAccessor);
    const kingsCourtDistribution = determineProbabilityMassDistribution(kingsCourtData, bidDataAccessor);
    return {
      "Bids": bids,
      "Iron Throne Distribution": ironThroneDistribution,
      "Fiefdom Distribution": fiefdomDistribution,
      "King's Court Distribution": kingsCourtDistribution,
      "Average Bid": AverageBid
    };
  };
  var tracksMapping = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court"
  };

  // InjectScript/InjectScript.js
  (function() {
    console.log("Tampermonkey: Injection attempting to attach to process");
    const checkInterval = setInterval(() => {
      if (window.gameClient) {
        clearInterval(checkInterval);
        console.log("Tampermonkey: Game client and state found. Injecting hook.");
        const gameClient = window.gameClient;
        const originalOnMessage = gameClient.onMessage;
        gameClient.onMessage = function() {
          const originalFunction = originalOnMessage.apply(this, arguments);
          try {
            console.log(`--- CAPTURED GAME STATE FOR ${gameClient.entireGame.name} ---`);
            const GameState = gameClient.entireGame.childGameState;
            const GameLogs = GameState.gameLogManager.logs;
            console.log(extractGameData(GameLogs));
          } catch (error) {
            console.error("Tampermonkey Hook Error:", error);
          }
          return originalFunction;
        };
      }
    }, 100);
  })();
})();
