import XLSX from "xlsx";
import fs from "fs";

const jsonObj= fs.readFileSync('routers.json','utf8' );
const parsedJson= JSON.parse(jsonObj);
const rows = parsedJson.routers;
const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "All Routers");
XLSX.writeFile(workbook, "All_Routers.xlsx");
console.log("✅ Excel file created: All_Routers.xlsx");