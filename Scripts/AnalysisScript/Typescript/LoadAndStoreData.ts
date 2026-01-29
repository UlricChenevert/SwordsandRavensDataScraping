import fs from 'fs/promises';
import { ScrapedData } from "../../Contracts/ExtractionContracts.js";
import { AnalyzedData } from '../../Contracts/AnalysisContracts.js';

const defaultReadDirectory = "./ScrapedData/CollectedData/"
const defaultWriteDirectory = "./ScrapedData/AnalyzedData/"

const analyzedDataName = "AnalyzedData.json"

export const RemoveRedundantData = (scrapedData : ScrapedData[]) => {
    const GameIDSet = new Set()
    const finalData : ScrapedData[] = []

    scrapedData.forEach(file => {
        const id = Object.keys(file)[0]

        if (GameIDSet.has(id)) return

        GameIDSet.add(id)
        finalData.push(file)
    });

    return finalData
}


export async function loadScrappedData(amount = 1) {
    const directoryData = await fs.readdir(defaultReadDirectory)

    if (amount < 0) amount = directoryData.length
    directoryData.slice(0, amount)

    const scrapedFiles = directoryData.map((fileName)=>{
        return fs.readFile(defaultReadDirectory + fileName, 'utf8')
            .then((rawFile)=>{return JSON.parse(rawFile) as ScrapedData})
    })

    return await Promise.all(scrapedFiles)
} 

export async function loadAnalyzedData() {
    return fs.readFile(defaultReadDirectory + analyzedDataName, 'utf8')
        .then((rawFile)=>{return JSON.parse(rawFile) as AnalyzedData})
        .catch(() => {
            return {} as AnalyzedData;
        });
}

export async function storeData (data : AnalyzedData, override = true) {
    if (override) {
        const directoryData = await fs.readdir(defaultWriteDirectory)
        directoryData.forEach((fileName)=>{fs.rm(defaultWriteDirectory+fileName)})
    }

    fs.writeFile(defaultWriteDirectory + analyzedDataName, JSON.stringify(data))
}