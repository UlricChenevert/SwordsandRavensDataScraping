// ==UserScript==
// @name         Capture Swords & Ravens Data
// @namespace    http://tampermonkey.net/
// @version      2025-12-03
// @description  Capture Game Data
// @author       You
// @match        http://127.0.0.1:5500/test.html
// @grant        none
// ==/UserScript==
import { extractGameData } from "./ExtractGameData";
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
                    // console.log(this)
                    const GameState = gameClient.entireGame.childGameState;
                    const GameLogs = GameState.gameLogManager.logs;
                    console.log(extractGameData(GameLogs));
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