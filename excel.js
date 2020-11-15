"use strict";

const Excel = require("exceljs");
const moment = require("moment");

const SaveFile = async (dataSheets) => {
  const workbook = new Excel.Workbook();
  workbook.creator = "Thu Huyen";
  workbook.lastModifiedBy = "Thu Huyen";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const sheet = workbook.addWorksheet("Google Rank Report");

  dataSheets.map((data, index) => {
    sheet.getCell("A" + (index + 1)).value = data[0];
    sheet.getCell("B" + (index + 1)).value = data[1];
  });

  await workbook.xlsx.writeFile(
    "./google-rank-report-" + moment().format("YYYY-MM-DD") + ".xlsx"
  );
};

module.exports = {
  SaveFile,
};
