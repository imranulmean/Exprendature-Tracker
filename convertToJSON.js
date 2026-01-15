import XLSX from 'xlsx'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const workbook = XLSX.readFile(path.join(__dirname, 'routersDetails.xlsx'))

const sheet = workbook.Sheets[workbook.SheetNames[0]]
const routersArray = XLSX.utils.sheet_to_json(sheet)
const routersJSON = { routers: routersArray };

const outputFile = path.join(__dirname, 'newRouter.json');
writeFileSync(outputFile, JSON.stringify(routersJSON, null, 2));

console.log(`✅ JSON file saved at ${outputFile}`);
