"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
;
;
const register_service_1 = require("../services/register.service");
const error_logs_service_1 = require("../services/error-logs.service");
class RegisterController {
  delDuplicateRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const workbook = xlsx_1.default.readFile('src/public/downloads/duplicate_registers.xlsx');
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const dupRegisters = xlsx_1.default.utils.sheet_to_json(worksheet);
      let cantOk = 0;
      for (let i = 0; i < dupRegisters.length; i++) {
        yield register_service_1.registerService.deleteDuplicates(dupRegisters[i].userId, dupRegisters[i].cantidad)
          .then(data => { cantOk += 1; })
          .catch(err => err);
        console.log('Register: ', i);
      }
      ;
      return res.send(`Proceso finalizado. Registers procesados: ${dupRegisters.length}. Registers eliminados: ${cantOk}`).status(200);
    });
  }
  InsertHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const regExpFullname = /(.*),(.*)/gm;
      const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;
      const workbook = xlsx_1.default.readFile('src/public/downloads/history_register.xlsx');
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const registers = xlsx_1.default.utils.sheet_to_json(worksheet);
      console.log(registers.length);
      let insertValues = '';
      for (let i = 0; i < registers.length; i++) {
        if (i > 0 && i % 1000 === 0) {
          console.log('*** i:', i);
          yield exports.registerController.sendHistoryData(insertValues);
          insertValues = '';
        }
        ;
        try {
          const register = registers[i];
          const puserId = register.userId ? register.userId : 'no user';
          const pevent = register.event ? register.event : 'register';
          const psource = register.source ? register.source : 'ma';
          const pname = (register.lastname ? register.lastname.replace(regExpFullname, '$2').replace(/'/g, '').trim() : '');
          const plastname = (register.lastname ? register.lastname.replace(regExpFullname, '$1').replace(/'/g, '').trim() : '');
          const pemail = (register.email && regExpEmail.test(register.email) ? register.email.replace(/'/g, '') : '');
          const pcountry = register.country ? register.country : '';
          let ptimestamp = register.timestamp ? register.timestamp : '';
          if (regExpTimestamp.test(ptimestamp)) {
            ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
              return args[4] + '/' + args[2].padStart(2, '0') + '/' + args[3].padStart(2, '0') + ' ' + args[5] + ' ' + args[6];
            });
          }
          ;
          const pidp = register.idp ? register.idp : '';
          insertValues += `('${puserId}','${pevent}','${psource}','${pname}','${plastname}','${pemail}','${pcountry}','${ptimestamp}','${pidp}'),`;
        }
        catch (error) {
          console.log('*** Error reg: ', i);
          console.log(error);
        }
      }
      yield exports.registerController.sendHistoryData(insertValues);
      console.log('*** FIN PROCESO history_register ***');
      return res.send('Proceso finalizado').status(200);
    });
  }
  sendHistoryData(valuesCmd) {
    return __awaiter(this, void 0, void 0, function* () {
      if (valuesCmd !== '') {
        const sqlCmd = `INSERT INTO history_register (user_id, event, source, name, lastname, email, country, timestamp, idp) VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
        return yield register_service_1.registerService.insertRegisterHistory(sqlCmd)
          .then(data => {
            console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
            return;
          })
          .catch(err => {
            console.log('ERROR: ', err);
            error_logs_service_1.errorLogsService.addError('history_register', err.substring(1, 4000))
              .then(data => null)
              .catch(err => null);
            return;
          });
      }
      ;
      return;
    });
  }
}
exports.registerController = new RegisterController();
