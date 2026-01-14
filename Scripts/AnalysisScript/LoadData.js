import fs from 'fs/promises';
const defaultDirectory = "./ScrapedData/CollectedData/";
export const RemoveRedundantData = (scrapedData) => {
    const GameIDSet = new Set();
    const finalData = [];
    scrapedData.forEach(file => {
        const id = Object.keys(file)[0];
        if (GameIDSet.has(id))
            return;
        GameIDSet.add(id);
        finalData.push(file);
    });
    return finalData;
};
export async function loadData(amount = 1) {
    const directoryData = await fs.readdir(defaultDirectory);
    if (amount < 0)
        amount = directoryData.length;
    directoryData.slice(0, amount);
    const scrapedFiles = directoryData.map((fileName) => {
        return fs.readFile(defaultDirectory + fileName, 'utf8')
            .then((rawFile) => { return JSON.parse(rawFile); });
    });
    return await Promise.all(scrapedFiles);
}
//# sourceMappingURL=LoadData.js.map