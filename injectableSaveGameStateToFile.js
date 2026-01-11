// ==UserScript==
// @name         Capture Swords & Ravens Data
// @namespace    http://tampermonkey.net/
// @version      2025-12-03
// @description  Capture Game Data
// @author       You
// @match        https://swordsandravens.net/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("Tampermonkey: Injection attempting to attach to process")

    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
            }
            return value;
        };
    };

    const checkInterval = setInterval(() => {
        if (window.gameClient) {
            clearInterval(checkInterval); // Stop checking once found
            
            console.log("Tampermonkey: Game client and state found. Injecting hook.");
            
            const gameClient = window.gameClient; 

            const originalOnMessage = gameClient.onMessage;
            
            gameClient.onMessage = function(message) {
                const originalFunction = originalOnMessage.apply(this, arguments);

                // The 'entireGameInstance' is now updated by the site's logic
                
                try {
                    // Example: Logging the state
                    console.log(`--- CAPTURED GAME STATE FOR ${gameClient.entireGame.name} ---`);
                    
                    const GameState = gameClient.entireGame.childGameState
                    const GameLogs = GameState.gameLogManager.logs
                    // console.log(GameState)
                    console.log(GameLogs)
                    console.log(extractGameData(GameLogs))
                    
                } catch (error) {
                    console.error("Tampermonkey Hook Error:", error);
                }
                
                return originalFunction; 
            };
            
        } else {
            // console.log("Waiting for game objects...");
        }
    }, 100); // Check every half second

    const extractGameData = (logs) => {
        const logData = logs.map((log)=>log.data)

        const bidsData = logData.filter((log)=>log.type == "clash-of-kings-bidding-done" && log.distributor === null)

        const uniqueTypes = [...new Set(logData.map((log)=>log.type))];

        const bids = [];

        for (let i = 0; i < bidsData.length; i++) {
            const bidInstance = bidsData[i]
            const bidResults = bidInstance.results

            for (let bidAmountInstanceIndex = 0; bidAmountInstanceIndex < bidResults.length; bidAmountInstanceIndex++) {
                // const bidAmountFactionInstance = bidResults[bidAmountInstanceIndex];

                const bidAmountInstance = bidResults[bidAmountInstanceIndex]

                for (let factionBidIndex = 0; factionBidIndex < bidAmountInstance[1].length; factionBidIndex++) {
                    const factionBidInstance = bidAmountInstance[1][factionBidIndex]

                    bids.push({"Track" : tracksMapping[bidInstance.trackerI], "Amount": bidAmountInstance[0], "Faction": factionBidInstance})
                }

            }
        }


        const AverageBid = 0;

        const ironThroneData = bids.filter((bidData)=>bidData.Track == "Iron Throne")
        const fiefdomData = bids.filter((bidData)=>bidData.Track == "Fiefdom")
        const kingsCourtData = bids.filter((bidData)=>bidData.Track == "King's Court")

        const bidDataAccessor = (element)=>element.Amount

        const ironThroneDistribution = determineProbabilityMassDistribution(ironThroneData, bidDataAccessor)
        const fiefdomDistribution = determineProbabilityMassDistribution(fiefdomData, bidDataAccessor)
        const kingsCourtDistribution = determineProbabilityMassDistribution(kingsCourtData, bidDataAccessor)

        return {
            "Bids" : bids,
            "Iron Throne Distribution" : ironThroneDistribution,
            "Fiefdom Distribution" : fiefdomDistribution,
            "King's Court Distribution" : kingsCourtDistribution,
            "Average Bid": AverageBid,
            "Unique Log Types" : uniqueTypes
        }
    }

    const tracksMapping = {
        0: "Iron Throne",
        1: "Fiefdom",
        2: "King's Court"
    }

    const StandardZScores = {
        .99: 2.575,
        .95: 1.96,
        .90: 1.645,
    }

    const determineConfidenceInterval = (sampleAverage, standardDeviation, sampleSize, desiredConfidenceInterval = .90) => {
        const zScore = StandardZScores[desiredConfidenceInterval]
        const errorMargin = zScore * standardDeviation / Math.sqrt(sampleSize)
        
        const UpperBound = sampleAverage - errorMargin
        const LowerBound = sampleAverage + errorMargin

        return {UpperBound: UpperBound, LowerBound: LowerBound}
    }

    const determineProbabilityMassDistribution = (dataArray, numberAccessor) => {
        const sampleSize = dataArray.length;
        if (sampleSize === 0) return {};

        const rawCounts = {};
        const distribution = {};

        // 1. Calculate Raw Counts (Frequency)
        dataArray.forEach(element => {
            const number = numberAccessor(element);
            rawCounts[number] = (rawCounts[number] || 0) + 1; // Increment count
        });

        // 2. Calculate Probability (Relative Frequency = Count / Total)
        for (const bidAmount in rawCounts) {
            distribution[bidAmount] = rawCounts[bidAmount] / sampleSize;
        }

        return distribution;
    }

})();