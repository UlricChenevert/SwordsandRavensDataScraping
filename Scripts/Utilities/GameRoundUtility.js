export const findCorrespondingRound = (targetIndex, mapping) => {
    let nextRoundIndex = mapping.findIndex((round) => round.index >= targetIndex);
    if (nextRoundIndex === -1)
        return mapping[mapping.length - 1];
    return mapping[nextRoundIndex - 1];
};
//# sourceMappingURL=GameRoundUtility.js.map