(() => {
  // Scripts/Modules/DownloadData.ts
  var DownloadData = (data, downloadFileBaseName, override = false) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileBaseName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ScrapedData/GameConstants.ts
  var tracksMapping = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court"
  };

  // Scripts/Modules/BiddingExtraction.ts
  var extractBidData = (logData) => {
    const trackBidsData = logData.filter(
      (log) => log.type == "clash-of-kings-bidding-done" && log.distributor === null
      // No Targs
    );
    const trackBids = [];
    trackBidsData.forEach((bidInstance) => {
      bidInstance.results.forEach((bidAmountInstance) => {
        bidAmountInstance[1].forEach((factionBidInstance) => {
          trackBids.push({
            Track: tracksMapping[bidInstance.trackerI],
            Amount: bidAmountInstance[0],
            Faction: factionBidInstance
          });
        });
      });
    });
    const wildlingBidData = logData.filter((log) => log.type == "wildling-bidding");
    const wildlingBids = [];
    wildlingBidData.forEach((bidInstance) => {
      bidInstance.results.forEach((bidAmountInstance) => {
        bidAmountInstance[1].forEach((factionBidInstance) => {
          wildlingBids.push({
            Amount: bidAmountInstance[0],
            Faction: factionBidInstance
          });
        });
      });
    });
    return { TrackBids: trackBids, WildlingBids: wildlingBids };
  };

  // Scripts/Modules/MilitaryExtraction.ts
  var extractBattleStats = (combatLogs) => {
    return combatLogs.map((combat, index) => {
      const winner = combat.stats.find((s) => s.isWinner);
      const loser = combat.stats.find((s) => !s.isWinner);
      return {
        region: winner?.region || "unknown",
        winner: winner?.house || "unknown",
        loser: loser?.house || "unknown",
        winnerArmy: winner?.army || 0,
        loserArmy: loser?.army || 0,
        winnerHouseCard: winner?.houseCard || null,
        loserHouseCard: loser?.houseCard || null,
        support: (winner?.support || 0) + (loser?.support || 0),
        location: winner?.region || "unknown",
        timestamp: index
      };
    });
  };
  var extractMilitaryData = (logData) => {
    const combatLogs = logData.filter((log) => log.type === "combat-result");
    const attackLogs = logData.filter((log) => log.type === "attack");
    const commonBattleStats = extractBattleStats(combatLogs);
    return {
      commonBattleStats,
      combatLogs,
      attackLogs
    };
  };

  // Scripts/Modules/PlayerExtraction.ts
  var extractPlayerData = (client) => {
    const GameState = client.entireGame.childGameState;
    const finalPlayerList = [];
    GameState.players.forEach((playerEntry) => {
      const finalPlayerData = {
        playerID: playerEntry.user.id,
        playerName: playerEntry.user.name
      };
      finalPlayerList.push(finalPlayerData);
    });
    return { Players: finalPlayerList };
  };

  // Scripts/Modules/ExtractGameData.ts
  var extractGameData = (GameClient) => {
    const GameState = GameClient.entireGame.childGameState;
    const GameLogs = GameState.gameLogManager.logs;
    const extractedData = {};
    Object.assign(extractedData, extractLogData(GameLogs, [extractBidData, extractMilitaryData]));
    Object.assign(extractedData, extractMiscData(GameClient, [extractPlayerData]));
    return extractedData;
  };
  var extractLogData = (logs, Extractors) => {
    const logData = logs.map((log) => log.data);
    const finalObject = {};
    Extractors.forEach((trackerLambda) => {
      Object.assign(finalObject, trackerLambda(logData));
    });
    return finalObject;
  };
  var extractMiscData = (GameClient, Extractors) => {
    const finalObject = {};
    Extractors.forEach((extractionLambda) => {
      Object.assign(finalObject, extractionLambda(GameClient));
    });
    return finalObject;
  };

  // Scripts/InjectScript/InjectScript.js
  (function() {
    console.log("Tampermonkey: Injection attempting to attach to process");
    let downloadedData = false;
    const checkInterval = setInterval(() => {
      if (window.gameClient) {
        clearInterval(checkInterval);
        console.log("Tampermonkey: Game client and state found. Injecting hook.");
        const gameClient = window.gameClient;
        const originalOnMessage = gameClient.onMessage;
        gameClient.onMessage = function() {
          const originalFunction = originalOnMessage.apply(this, arguments);
          if (!downloadedData) {
            try {
              console.log(`--- EXTRACTING GAME STATE FOR ${gameClient.entireGame.name} ---`);
              const extractedData = extractGameData(gameClient);
              console.log(extractedData);
              DownloadData({ [gameClient.authData.gameId]: extractedData }, "GameOfThronesGameData");
              console.log(`--- CAPTURED GAME STATE FOR ${gameClient.entireGame.name} ---`);
              downloadedData = true;
            } catch (error) {
              console.error("Tampermonkey Hook Error:", error);
            }
          }
          return originalFunction;
        };
      }
    }, 100);
  })();
})();
