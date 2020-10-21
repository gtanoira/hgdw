/* eslint-disable @typescript-eslint/no-explicit-any */
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import Blob from 'cross-blob';

// Envirnoment
import { STATIC_PATH } from '../settings/environment.settings';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

class ExcelExporterService {

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    console.log('**EXCEL:');
    console.log(json);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['GA']
    };
    // XLSX.writeFile(workbook, `${STATIC_PATH}/downloads/${excelFileName + new Date().getTime() + EXCEL_EXTENSION}`, { bookType: 'xlsx', type: 'buffer' });
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    excelExporterService.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    
    const data = new Blob(
      [buffer],
      {type: EXCEL_TYPE}
    );
    FileSaver.saveAs(data, `${STATIC_PATH}/downloads/${fileName + new Date().getTime() + EXCEL_EXTENSION}`);
  }

}

export const excelExporterService = new ExcelExporterService();