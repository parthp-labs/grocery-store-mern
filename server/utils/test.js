import path, { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import ExcelJs from "exceljs";
import fs from "fs";

const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);

const workbook = new ExcelJs.Workbook();

await workbook.xlsx.readFile(`${path.join(__dirname, "/trial.xlsx")}`);

if (!fs.existsSync(path.join(__dirname, "/trial.xlsx"))) {
  throw new Error("Template file does not exist");
} else {
  console.log("Exists");
}

const worksheet = workbook.getWorksheet(1);

// worksheet.getCell("F5").value = "ORDER ID2: ";
worksheet.getCell("F6").value = "PLACED ON2:";
worksheet.getCell("F7").value = "PAYMENT MODE2:";

await workbook.xlsx.writeFile(path.join(__dirname, "generate.xlsx"));
