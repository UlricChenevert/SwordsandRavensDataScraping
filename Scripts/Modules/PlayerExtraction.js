export const extractPlayerData = (client) => {
    const GameState = client.entireGame.childGameState;
    const finalPlayerList = [];
    GameState.players.forEach(playerEntry => {
        const finalPlayerData = {
            playerID: playerEntry.user.id,
            playerName: playerEntry.user.name
        };
        finalPlayerList.push(finalPlayerData);
    });
    return { Players: finalPlayerList };
};
//# sourceMappingURL=PlayerExtraction.js.map