from typing import Dict, List

from Contracts.ExtractionContracts import BattleLog, BattleParticipantLog, CleanHouseSnapshot, CombatLog, ExtractedRoundData, GameLocation, GameSettings, PlayerInfo, ScrapedGameEntry, UnitState

def convertPlayerToPlainText(players: List[PlayerInfo]):
    final = ""

    for player in players:
        final += player["playerName"] + " "

    return final

def convertSettingsToPlainText(settings: GameSettings):
    finalOutput = ""

    for property, value in settings.items():
        finalOutput += f"{property}: {value}"

    return finalOutput

def convertBattleLogToPlainText(battle: BattleLog):
    return f"Faction {battle["Attacker"]} attacked {battle["Defender"]} in {battle["AttackedRegion"]} from {battle["AttackerRegion"]}"

def convertSupportIntoPlainText(participant : BattleParticipantLog):
    if (participant["SupportStrength"] == 0): return ""
    
    support = f"Through the factions {" ".join(participant["SupportingFactions"])}, {participant["House"]} gained a total of {participant["SupportStrength"]} support"
    
    if (participant["RefusedSupport"]):
        support += " and refused support"

    support += "."

    return support

def convertBattleParticipantLogToPlainText(participant : BattleParticipantLog):
    armyUnits = " ".join(participant['ArmyUnits'])
    support = convertSupportIntoPlainText(participant)

    orderType = participant.get("OrderType") if (participant.get("OrderType")) is not None else "used"
    tidesOfBattle = participant.get("TidesOfBattleCard") if (participant.get("OrderType")) is not None else "Unknown"

    return f"""
    {participant["House"]} {orderType} with a bonus of {participant["OrderBonus"]}, {armyUnits}, and the house card {participant['HouseCard']}. 
    {support}
    {f"{participant["House"]} also has the wounded troops f{" ".join(participant["WoundedUnits"])}" if participant["WoundedUnits"].__len__() > 0 else ""}
    These factors resulted in these scores for {participant["House"]}:
    Army: {participant["ArmyStrength"]}
    Support: {participant["SupportStrength"]}
    House Card: {participant["HouseCardStrength"]}
    Tides of Battle Card: {tidesOfBattle}
    {f"Used the Valyrian Steel Blade" if not participant['ValyrianSteelBlade'] == 0 else ""}
    Total: {participant["Total"]}
    """

def convertCombatToPlainText(combat: CombatLog):
    return f"""
    {convertBattleLogToPlainText(combat["BattleData"])}

    {convertBattleParticipantLogToPlainText(combat['WinnerData'])}

    {convertBattleParticipantLogToPlainText(combat['LoserData'])}

    {combat['WinnerData']["House"]} won!
    """

def convertHouseSnapshotToPlainText(house : CleanHouseSnapshot):
    return f"""
    {house["FactionName"].capitalize()} Stats:
    Supply Tier: {house["SupplyTier"]}
    Power Tokens: {house["PowerTokens"]}
    Land: {" ".join(house["LandAreas"])} ({house["LandAreaCount"]} total)
    Castle Count (calculated at round's end): {house["RoundEndCastleCount"]}
    """

def convertUnitLocationsAndOrdersToPlainText(UnitLocationSnapshotData: Dict[GameLocation, List[UnitState]], OrderTokenChoices: Dict[GameLocation, str]):
    unitLocationsAndOrders = []
    for location, units in UnitLocationSnapshotData.items():
        if (units.__len__() == 0): continue

        orderToken = OrderTokenChoices.get(location, "no")

        unitTypes = [unit["type"] for unit in units]

        output = f"{units[0]['house']} has a {orderToken} order on {location} with units {" ".join(unitTypes)}"

        unitLocationsAndOrders.append(output)

    return " ".join(unitLocationsAndOrders)

def convertRoundToPlainText(round : ExtractedRoundData):
    factionInformation = []
    for faction in round["HouseSnapshotData"].values():
        if faction["SupplyTier"] == -1:
            continue
        factionInformation.append(convertHouseSnapshotToPlainText(faction))

    output = f"""
    Round {round['Round']} Stats: 

    
    Fiefdom Track: {" ".join(round['FiefdomTrack'])}
    Kings Court Track: {" ".join(round["KingsCourtThroneTrack"])}
    Iron Throne Track: {" ".join(round['IronThroneTrack'])}

    {"\n".join(factionInformation)}

    {convertUnitLocationsAndOrdersToPlainText(round['UnitLocationSnapshotData'], round['OrderTokenChoices'])}
    """
    return output

def convertLogIndexToRoundPlainText(currentGameStateReferenceIndex : int, roundData : List[ExtractedRoundData]):
    # Could do this more efficiently with binary search and an array implementation
    for round in roundData:
        if (currentGameStateReferenceIndex != round["LogIndex"]): continue
        return convertRoundToPlainText(round)
    
    raise IndexError(f"{currentGameStateReferenceIndex} index could not be found")

def buildContextForEvent(playerString : str, settingSettings : str, currentGameStateReferenceIndex : int, gameID : str, roundData : List[ExtractedRoundData]):
    return f"""
    Game: 
    {gameID}

    Settings:
    {settingSettings}

    Players:
    {playerString}
    
    {convertLogIndexToRoundPlainText(currentGameStateReferenceIndex, roundData)}
    """ 
