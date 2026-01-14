(() => {
  // Scripts/Extraction Modules/DownloadData.js
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

  // ScrapedData/GameConstants.js
  var HouseCardState;
  (function(HouseCardState2) {
    HouseCardState2[HouseCardState2["AVAILABLE"] = 0] = "AVAILABLE";
    HouseCardState2[HouseCardState2["USED"] = 1] = "USED";
  })(HouseCardState || (HouseCardState = {}));
  var PlayerActionType;
  (function(PlayerActionType2) {
    PlayerActionType2[PlayerActionType2["ORDERS_PLACED"] = 0] = "ORDERS_PLACED";
    PlayerActionType2[PlayerActionType2["BID_MADE"] = 1] = "BID_MADE";
    PlayerActionType2[PlayerActionType2["HOUSE_CARD_CHOSEN"] = 2] = "HOUSE_CARD_CHOSEN";
  })(PlayerActionType || (PlayerActionType = {}));
  var tracksMapping = {
    0: "Iron Throne",
    1: "Fiefdom",
    2: "King's Court"
  };
  var ConnectionState;
  (function(ConnectionState2) {
    ConnectionState2[ConnectionState2["INITIALIZING"] = 0] = "INITIALIZING";
    ConnectionState2[ConnectionState2["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState2[ConnectionState2["AUTHENTICATING"] = 2] = "AUTHENTICATING";
    ConnectionState2[ConnectionState2["SYNCED"] = 3] = "SYNCED";
    ConnectionState2[ConnectionState2["CLOSED"] = 4] = "CLOSED";
  })(ConnectionState || (ConnectionState = {}));

  // Scripts/Utilities/GameRoundUtility.js
  var findCorrespondingRound = (targetIndex, mapping) => {
    let nextRoundIndex = mapping.findIndex((round) => round.index >= targetIndex);
    if (nextRoundIndex === -1)
      return mapping[mapping.length - 1];
    return mapping[nextRoundIndex - 1];
  };

  // Scripts/Extraction Modules/BiddingExtraction.js
  var extractBidData = (logData, gameRoundMapping) => {
    const trackBids = [];
    logData.forEach((log, index) => {
      if (log.type != "clash-of-kings-bidding-done" || log.distributor !== null)
        return;
      log.results.forEach((bidAmountInstance) => {
        bidAmountInstance[1].forEach((factionBidInstance) => {
          trackBids.push({
            Track: tracksMapping[log.trackerI],
            Amount: bidAmountInstance[0],
            Faction: factionBidInstance,
            Round: findCorrespondingRound(index, gameRoundMapping).round
          });
        });
      });
    });
    const wildlingBids = [];
    logData.forEach((log, index) => {
      if (log.type != "wildling-bidding")
        return;
      log.results.forEach((bidAmountInstance) => {
        bidAmountInstance[1].forEach((factionBidInstance) => {
          wildlingBids.push({
            Amount: bidAmountInstance[0],
            Faction: factionBidInstance,
            Round: findCorrespondingRound(index, gameRoundMapping).round
          });
        });
      });
    });
    return { TrackBids: trackBids, WildlingBids: wildlingBids };
  };

  // Scripts/Extraction Modules/MilitaryExtraction.js
  var extractMilitaryData = (logData, gameRoundMapping) => {
    const combatLogs = [];
    logData.forEach((log, index) => {
      if (log.type !== "combat-result")
        return;
      const combatResult = log;
      const round = findCorrespondingRound(index, gameRoundMapping);
      let AttackLog;
      let SupportDeclaredLogs = [];
      let SupportRefusedLogs = [];
      let RoundBeginningTerminateInfiniteLoopCondition = false;
      let currentLogIsAttackLog = false;
      let logCorrelationIndex = index;
      while (!currentLogIsAttackLog && !RoundBeginningTerminateInfiniteLoopCondition) {
        logCorrelationIndex--;
        const correlatedLog = logData[logCorrelationIndex];
        if (correlatedLog.type == "support-declared") {
          SupportDeclaredLogs.push(correlatedLog);
        } else if (correlatedLog.type == "support-refused") {
          SupportRefusedLogs.push(correlatedLog);
        }
        RoundBeginningTerminateInfiniteLoopCondition = correlatedLog.type == "turn-begin";
        currentLogIsAttackLog = correlatedLog.type == "attack";
      }
      if (RoundBeginningTerminateInfiniteLoopCondition) {
        console.error("Infinite Log in extract military data");
        return;
      }
      AttackLog = logData[logCorrelationIndex];
      const winnerStats = combatResult.stats.find((s) => s.isWinner);
      const loserStats = combatResult.stats.find((s) => !s.isWinner);
      const winnerSupport = SupportDeclaredLogs.filter((support) => support.supported == winnerStats.house).map((support) => support.supporter);
      const loserSupport = SupportDeclaredLogs.filter((support) => support.supported == loserStats.house).map((support) => support.supporter);
      const winnerRefusedSupport = SupportRefusedLogs.filter((support) => support.house == winnerStats.house).length > 0;
      const loserRefusedSupport = SupportRefusedLogs.filter((support) => support.house == loserStats.house).length > 0;
      const winnerHouseCards = round.housesOnVictoryTrack.find((house) => house.id == AttackLog.attacker).houseCards.filter((x) => x.state == HouseCardState.AVAILABLE).map((x) => x.id);
      const loserHouseCards = round.housesOnVictoryTrack.find((house) => house.id == AttackLog.attacked).houseCards.filter((x) => x.state == HouseCardState.AVAILABLE).map((x) => x.id);
      const battleData = {
        Attacker: AttackLog.attacker,
        AttackerRegion: AttackLog.attackingRegion,
        Defender: AttackLog.attacked,
        AttackedRegion: AttackLog.attackedRegion
      };
      const winnerData = {
        House: winnerStats.house,
        OrderType: AttackLog.orderType,
        OrderBonus: winnerStats.orderBonus,
        ArmyStrength: winnerStats.army,
        ArmyUnits: winnerStats.armyUnits,
        WoundedUnits: winnerStats.woundedUnits,
        SupportStrength: winnerStats.support,
        SupportingFactions: winnerSupport,
        // Could be extracted from support logs if available
        RefusedSupport: winnerRefusedSupport,
        GarrisonStrength: winnerStats.garrison,
        HouseCard: winnerStats.houseCard,
        HouseCardStrength: winnerStats.houseCardStrength,
        ValyrianSteelBlade: winnerStats.valyrianSteelBlade,
        TidesOfBattleCard: winnerStats.tidesOfBattleCard,
        Total: winnerStats.total,
        HouseCardSelection: winnerHouseCards,
        FiefdomTrackPosition: round.fiefdomsTrack.findIndex((x) => x == AttackLog.attacker)
      };
      const loserData = {
        House: loserStats.house,
        OrderType: void 0,
        OrderBonus: loserStats.orderBonus,
        ArmyStrength: loserStats.army,
        ArmyUnits: loserStats.armyUnits || [],
        WoundedUnits: loserStats.woundedUnits || [],
        SupportStrength: loserStats.support,
        SupportingFactions: loserSupport,
        RefusedSupport: loserRefusedSupport,
        GarrisonStrength: loserStats.garrison,
        HouseCard: loserStats.houseCard,
        HouseCardStrength: loserStats.houseCardStrength,
        ValyrianSteelBlade: loserStats.valyrianSteelBlade,
        TidesOfBattleCard: loserStats.tidesOfBattleCard,
        Total: loserStats.total,
        HouseCardSelection: loserHouseCards,
        FiefdomTrackPosition: round.fiefdomsTrack.findIndex((x) => x == AttackLog.attacked)
      };
      combatLogs.push({
        BattleData: battleData,
        WinnerData: winnerData,
        LoserData: loserData,
        round: round.round
      });
    });
    return { combatLogs };
  };

  // Scripts/Extraction Modules/PlayerExtraction.js
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

  // Scripts/Extraction Modules/ExtractGameData.js
  var extractGameData = (GameClient) => {
    const GameState = GameClient.entireGame.childGameState;
    const GameLogs = GameState.gameLogManager.logs;
    const TurnMapping = extractGameTurnData(GameLogs);
    const extractedData = {};
    Object.assign(extractedData, extractLogData(GameLogs, [extractBidData, extractMilitaryData], TurnMapping));
    Object.assign(extractedData, extractMiscData(GameClient, [extractPlayerData]));
    return extractedData;
  };
  var extractLogData = (logs, Extractors, gameRoundToLogIndex) => {
    const logData = logs.map((log) => log.data);
    const finalObject = {};
    Extractors.forEach((trackerLambda) => {
      Object.assign(finalObject, trackerLambda(logData, gameRoundToLogIndex));
    });
    return finalObject;
  };
  var extractGameTurnData = (logs) => {
    const final = [];
    logs.forEach((log, index) => {
      if (log.data.type != "turn-begin")
        return;
      let orderRevealedIndex = index;
      while (logs[orderRevealedIndex].data.type != "orders-revealed")
        orderRevealedIndex++;
      const orderRevealed = logs[orderRevealedIndex].data;
      const ironTrack = orderRevealed.gameSnapshot?.ironThroneTrack ? orderRevealed.gameSnapshot?.ironThroneTrack : [];
      const fiefdomTrack = orderRevealed.gameSnapshot?.fiefdomsTrack ? orderRevealed.gameSnapshot?.fiefdomsTrack : [];
      const kingsCourtTrack = orderRevealed.gameSnapshot?.kingsCourtTrack ? orderRevealed.gameSnapshot?.kingsCourtTrack : [];
      const victoryTrack = orderRevealed.gameSnapshot?.housesOnVictoryTrack ? orderRevealed.gameSnapshot?.housesOnVictoryTrack : [];
      final.push({
        index,
        round: log.data.turn,
        wildlingStrength: orderRevealed.gameSnapshot?.wildlingStrength,
        dragonStrength: orderRevealed.gameSnapshot?.dragonStrength,
        ironThroneTrack: ironTrack,
        fiefdomsTrack: fiefdomTrack,
        kingsCourtTrack,
        housesOnVictoryTrack: victoryTrack,
        vsbUsed: orderRevealed.gameSnapshot?.vsbUsed,
        ironBank: orderRevealed.gameSnapshot?.ironBank
      });
    });
    return final;
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
    }, 500);
  })();
})();
