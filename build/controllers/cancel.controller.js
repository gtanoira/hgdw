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
exports.cancelController = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
;
const cancel_service_1 = require("../services/cancel.service");
const error_logs_service_1 = require("../services/error-logs.service");
class CancelController {
    InsertCancelHistory(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;
            const workbook = xlsx_1.default.readFile('src/public/downloads/history_cancel.xlsx');
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const registers = xlsx_1.default.utils.sheet_to_json(worksheet);
            let insertValues = '';
            for (let i = 0; i < registers.length; i++) {
                if (i > 0 && i % 1000 === 0) {
                    console.log('*** i:', i);
                    yield exports.cancelController.sendCancelHistoryData(insertValues);
                    insertValues = '';
                }
                ;
                try {
                    const register = registers[i];
                    const puserId = register.user_id ? register.user_id : 'no user';
                    let ptimestamp = (_a = register.timestamp) === null || _a === void 0 ? void 0 : _a.toString();
                    if (regExpTimestamp.test(ptimestamp)) {
                        ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
                            return args[4] + '/' + args[2].padStart(2, '0') + '/' + args[3].padStart(2, '0') + ' ' + args[5] + ' ' + args[6];
                        });
                    }
                    ;
                    const pevent = register.event ? register.event : 'cancel';
                    const psource = register.source ? register.source : '';
                    const pchannel = register.channel ? register.channel : '';
                    insertValues += `('${puserId}','${ptimestamp}','${pevent}','${psource}','${pchannel}'),`;
                }
                catch (error) {
                    console.log('*** Error reg: ', i);
                    console.log(error);
                }
            }
            yield exports.cancelController.sendCancelHistoryData(insertValues);
            console.log('*** FIN PROCESO history_cancel ***');
            return res.send('Proceso finalizado').status(200);
        });
    }
    sendCancelHistoryData(valuesCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (valuesCmd !== '') {
                const sqlCmd = `INSERT INTO history_cancel (user_id, timestamp, event, source, channel) `
                    + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
                return yield cancel_service_1.cancelService.insertCancelHistory(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return;
                })
                    .catch(err => {
                    console.log('ERROR: ', err);
                    error_logs_service_1.errorLogsService.addError('history_cancel', err.toString().substring(1, 4000), 'nocode', 0)
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
exports.cancelController = new CancelController();
