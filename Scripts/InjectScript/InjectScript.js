// ==UserScript==
// @name         Capture Swords & Ravens Data
// @version      2026-1-11
// @description  Capture Game Data
// @match        https://swordsandravens.net/play/*
// @require      file://C:/Users/WUlri/Nextcloud/Projects/Screenscraping/injectionScript.js
// ==/UserScript==
import { DownloadData } from "../Modules/DownloadData";
import { extractGameData } from "../Modules/ExtractGameData";
(function () {
    console.log("Tampermonkey: Injection attempting to attach to process");
    const checkInterval = setInterval(() => {
        if (window.gameClient) {
            clearInterval(checkInterval); // Stop checking once found
            console.log("Tampermonkey: Game client and state found. Injecting hook.");
            const gameClient = window.gameClient;
            const originalOnMessage = gameClient.onMessage;
            gameClient.onMessage = function () {
                const originalFunction = originalOnMessage.apply(this, arguments);
                try {
                    console.log(`--- CAPTURED GAME STATE FOR ${gameClient.entireGame.name} ---`);
                    const GameState = gameClient.entireGame.childGameState;
                    const GameLogs = GameState.gameLogManager.logs;
                    DownloadData(extractGameData(GameLogs), "It works!");
                }
                catch (error) {
                    console.error("Tampermonkey Hook Error:", error);
                }
                return originalFunction;
            };
        }
    }, 100); // Check every half second
})();
//# sourceMappingURL=InjectScript.js.map