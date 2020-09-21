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
const moment_1 = __importDefault(require("moment"));
const xlsx_1 = __importDefault(require("xlsx"));
const functions_common_1 = require("../common/functions.common");
const environment_settings_1 = require("../settings/environment.settings");
const cancel_service_1 = require("../services/cancel.service");
const error_logs_service_1 = require("../services/error-logs.service");
class CancelController {
    constructor() {
        this.rtn_status = 400;
    }
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
                try {
                    const register = registers[i];
                    const puserId = register.user_id ? register.user_id : 'no user';
                    let ptimestamp = (_a = register.timestamp) === null || _a === void 0 ? void 0 : _a.toString();
                    if (regExpTimestamp.test(ptimestamp)) {
                        ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
                            return args[4] + '/' + args[2].padStart(2, '0') + '/' + args[3].padStart(2, '0') + ' ' + args[5] + ' ' + args[6];
                        });
                    }
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
                        .then(() => null)
                        .catch(() => null);
                    return;
                });
            }
            return;
        });
    }
    InsertMissingCancel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = yield exports.cancelController.saveUploadFile(req)
                .then(data => data)
                .catch((err) => {
                return res.status(503).send({ message: err });
            });
            yield cancel_service_1.cancelService.startTransaction();
            let insertValues = '';
            let regsGrabados = 0;
            try {
                const workbook = xlsx_1.default.readFile(`${environment_settings_1.STATIC_PATH}/uploads/${filename}`);
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const registers = xlsx_1.default.utils.sheet_to_json(worksheet);
                console.log(registers.length);
                for (let i = 0; i < registers.length; i++) {
                    if (i > 0 && i % 1000 === 0) {
                        console.log('*** i:', i);
                        yield exports.cancelController.sendMissingCancel(insertValues)
                            .then(data => {
                            regsGrabados += data;
                        })
                            .catch(err => {
                            exports.cancelController.rtn_status = 503;
                            throw new Error(`HTG-012(E): SQL error: ${err}`);
                        });
                        insertValues = '';
                    }
                    const register = registers[i];
                    const paccessUntil = functions_common_1.getDateFromExcel(register.accessUntil ? +register.accessUntil : 0).toISOString();
                    const ptimestamp = functions_common_1.getDateFromExcel(register.timestamp ? +register.timestamp : 0).toISOString();
                    const puserAgent = register.userAgent ? register.userAgent : '';
                    insertValues += `('${register.userId}','${register.source}','${register.event}','${register.channel}'` +
                        `,'${ptimestamp}','${paccessUntil}','${puserAgent}'),`;
                    if (insertValues.indexOf('undefined') > 0) {
                        exports.cancelController.rtn_status = 400;
                        throw new Error(`HTG-011(E): validando la fila ${i + 2} del excel: faltan 1 o más campos.`);
                    }
                }
            }
            catch (err) {
                console.log();
                console.log('*** ERROR:');
                console.log(err);
                exports.cancelController.rtn_status = exports.cancelController.rtn_status === 200 ? 503 : exports.cancelController.rtn_status;
                yield cancel_service_1.cancelService.rollbackTransaction();
                yield cancel_service_1.cancelService.endTransaction();
                return res.status(exports.cancelController.rtn_status).send({ message: err.toString().replace(/Error: /g, '') });
            }
            exports.cancelController.rtn_status = 200;
            let rtn_message = { message: `${regsGrabados} registro/s grabados` };
            if (insertValues === '') {
                cancel_service_1.cancelService.commitTransaction();
            }
            else {
                yield exports.cancelController.sendMissingCancel(insertValues)
                    .then((data) => {
                    regsGrabados += data;
                    rtn_message = { message: `${regsGrabados} registro/s grabados` };
                    cancel_service_1.cancelService.commitTransaction();
                })
                    .catch(err => {
                    cancel_service_1.cancelService.rollbackTransaction();
                    exports.cancelController.rtn_status = 503;
                    rtn_message = { message: `HTG-012(E): SQL error: ${err}` };
                });
            }
            cancel_service_1.cancelService.endTransaction();
            error_logs_service_1.errorLogsService.addError('missing_cancel', rtn_message.message, 'nocode', 0);
            console.log('*** FIN:', exports.cancelController.rtn_status, rtn_message);
            return res.status(exports.cancelController.rtn_status).send(rtn_message);
        });
    }
    sendMissingCancel(valuesCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (valuesCmd !== '') {
                const sqlCmd = `INSERT INTO Datalake.cancel (user_id, source, event, channel, timestamp, access_until, user_agent)` +
                    ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
                return yield cancel_service_1.cancelService.insertMissingCancel(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return data.affectedRows;
                })
                    .catch(err => {
                    error_logs_service_1.errorLogsService.addError('missing_cancel', err.toString().substring(0, 4000), 'nocode', 0)
                        .then(() => null)
                        .catch(() => null);
                    return Promise.reject(err);
                });
            }
            return 0;
        });
    }
    saveUploadFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files || Object.keys(req.files).length === 0) {
                return Promise.reject('HTG-013(E): file upload (no se recibió ningún archivo)');
            }
            const fileUpload = req.files.uploadCancel;
            const filename = `pyc_${moment_1.default().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
            return yield fileUpload.mv(`${environment_settings_1.STATIC_PATH}/uploads/${filename}`)
                .then(() => filename)
                .catch((err) => Promise.reject(err));
        });
    }
}
exports.cancelController = new CancelController();
