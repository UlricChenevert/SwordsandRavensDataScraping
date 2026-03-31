from typing import List

from Contracts.ExtractionContracts import BattleLog, BattleParticipantLog, CombatLog, PlayerInfo

def convertPlayerToPlainText(players: List[PlayerInfo]):
    final = "Players: "

    for player in players:
        final += player["playerName"] + " "

    return final

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
    {participant["House"]} {orderType} with a bonus of {participant["OrderBonus"]}, {armyUnits}, and the house card {participant['HouseCard']}. {support}
    These factors resulted in these scores for {participant["House"]}:
    Army: {participant["ArmyStrength"]}
    Support: {participant["SupportStrength"]}
    House Card: {participant["HouseCardStrength"]}
    Tides of Battle Card: {tidesOfBattle}
    Total: {participant["ArmyStrength"]}
    """

def convertCombatToPlainText(combat: CombatLog):
    return f"""
        {convertBattleLogToPlainText(combat["BattleData"])}

        {convertBattleParticipantLogToPlainText(combat['WinnerData'])}

        {convertBattleParticipantLogToPlainText(combat['LoserData'])}

        {combat['WinnerData']["House"]} won!
    """