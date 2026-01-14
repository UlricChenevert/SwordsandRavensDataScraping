// ==UserScript==
// @name         Capture Swords & Ravens Data
// @version      2026-1-11
// @description  Capture Game Data
// @author       You
// @match        https://swordsandravens.net/play/*
// @grant        none
// @require      http://localhost:3000/injectionScript.js
// ==/UserScript==

import { GameClient } from "../../ScrapedData/GameTypes.js";
import { DownloadData } from "../Extraction Modules/DownloadData.js";
import { extractGameData } from "../Extraction Modules/ExtractGameData.js";

(function() {
    console.log("Tampermonkey: Injection attempting to attach to process")
    let downloadedData = false

    const checkInterval = setInterval(() => {

        if ((window as any).gameClient) {
            clearInterval(checkInterval); // Stop checking once found
            
            console.log("Tampermonkey: Game client and state found. Injecting hook.");
            
            const gameClient = (window as any).gameClient as GameClient; 
            
            const originalOnMessage = gameClient.onMessage;
            
            gameClient.onMessage = function() {
                const originalFunction = originalOnMessage.apply(this, arguments);
                
                if (!downloadedData){
                try {
                    console.log(`--- EXTRACTING GAME STATE FOR ${gameClient.entireGame.name} ---`);

                    const extractedData = extractGameData(gameClient)
                    
                    console.log(extractedData)
                    DownloadData({[gameClient.authData.gameId]: extractedData}, "GameOfThronesGameData")
                    
                    console.log(`--- CAPTURED GAME STATE FOR ${gameClient.entireGame.name} ---`);
                    downloadedData = true

                } catch (error) {
                    console.error("Tampermonkey Hook Error:", error);
                }}
                
                return originalFunction; 
            };
            
        }
    }, 500); // Check every half second
}
)();