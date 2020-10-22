"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelExporterService = void 0;
const file_saver_1 = __importDefault(require("file-saver"));
const xlsx_1 = __importDefault(require("xlsx"));
const cross_blob_1 = __importDefault(require("cross-blob"));
const environment_settings_1 = require("../settings/environment.settings");
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';
class ExcelExporterService {
    exportAsExcelFile(json, excelFileName) {
        console.log('**EXCEL:');
        console.log(json);
        const worksheet = xlsx_1.default.utils.json_to_sheet(json);
        const workbook = {
            Sheets: { 'data': worksheet },
            SheetNames: ['GA']
        };
        const excelBuffer = xlsx_1.default.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        exports.excelExporterService.saveAsExcelFile(excelBuffer, excelFileName);
    }
    saveAsExcelFile(buffer, fileName) {
        const data = new cross_blob_1.default([buffer], { type: EXCEL_TYPE });
        file_saver_1.default.saveAs(data, `${environment_settings_1.STATIC_PATH}/downloads/${fileName + new Date().getTime() + EXCEL_EXTENSION}`);
    }
}
exports.excelExporterService = new ExcelExporterService();
