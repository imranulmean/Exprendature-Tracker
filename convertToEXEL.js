import XLSX from "xlsx";
import fs from "fs";

// const inputFile=`routers.json`;
const inputFile=`FinalResult.json`;
const jsonObj= fs.readFileSync(inputFile,'utf8' );
const parsedJson= JSON.parse(jsonObj);
const rows = parsedJson.routers;
///////////////
// const rows = parsedJson.map(item => {
//     const r = item?.result;
//     return {
//         branchId: r?.branchId || "" ,
//         router: r?.router || "",
//         host: r?.host || "" ,
//         routerType: r?.routerType || "" ,
//         results: r?.results ? JSON.stringify(r.results, null, 2) : "No Results"
//     };
// });
////////////////

const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "All Routers");
XLSX.writeFile(workbook, "All_Routers.xlsx");
console.log("✅ Excel file created: All_Routers.xlsx");