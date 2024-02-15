import * as XLSX from "xlsx";

export function exportWorksheet(f_n: string, json: any[], type: string) {
  let myFile = `${f_n}.${type}`;
  let myWorkSheet = XLSX.utils.json_to_sheet(json);
  let myWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "0");
  XLSX.writeFile(myWorkBook, myFile);
}
