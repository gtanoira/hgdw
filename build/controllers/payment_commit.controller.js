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
exports.paymentCommitController = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const moment_1 = __importDefault(require("moment"));
const functions_common_1 = require("../common/functions.common");
const environment_settings_1 = require("../settings/environment.settings");
const payment_commit_service_1 = require("../services/payment_commit.service");
const error_logs_service_1 = require("../services/error-logs.service");
class PaymentCommitController {
    constructor() {
        this.rtn_status = 400;
    }
    InsertMissingPyc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = yield exports.paymentCommitController.saveUploadFile(req)
                .then(data => data)
                .catch((err) => {
                return res.status(503).send({ message: err });
            });
            yield payment_commit_service_1.paymentCommitService.startTransaction();
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
                        yield exports.paymentCommitController.sendMissingPyc(insertValues)
                            .then(data => {
                            regsGrabados += data;
                        })
                            .catch(err => {
                            exports.paymentCommitController.rtn_status = 503;
                            throw new Error(`HTG-012(E): SQL error: ${err}`);
                        });
                        insertValues = '';
                    }
                    const register = registers[i];
                    const paccessUntil = functions_common_1.getDateFromExcel(register.accessUntil ? +register.accessUntil : 0).toISOString();
                    const ptimestamp = functions_common_1.getDateFromExcel(register.timestamp ? +register.timestamp : 0).toISOString();
                    if ('online,offline'.indexOf(register.paymentType) < 0) {
                        exports.paymentCommitController.rtn_status = 400;
                        throw new Error(`HTG-011(E): validando la fila ${i + 2} del excel: paymentType es incorrecto`);
                    }
                    const pmessage = register.message ? register.message : '';
                    const puserAgent = register.userAgent ? register.userAgent : '';
                    const ppaymentId = register.paymentId ? register.paymentId : '';
                    const ppackage = register.package ? register.package : '';
                    const ptrialDuration = register.trialDuration ? register.trialDuration : 0;
                    insertValues += `('${register.userId}','${register.status}','${paccessUntil}','${register.methodName}'` +
                        `,'${register.source}',${register.amount},'${register.paymentType}',${register.duration},'${pmessage}'` +
                        `,'${register.event}','${ptimestamp}','${puserAgent}',${register.discount},'${ppaymentId}'` +
                        `,${register.paymentType === 'online' ? 1 : 0},'${ppackage}',${register.trial},${ptrialDuration}),`;
                    if (insertValues.indexOf('undefined') > 0) {
                        exports.paymentCommitController.rtn_status = 400;
                        throw new Error(`HTG-011(E): validando la fila ${i + 2} del excel: faltan 1 o más campos.`);
                    }
                }
            }
            catch (err) {
                console.log();
                console.log('*** ERROR:');
                console.log(err);
                exports.paymentCommitController.rtn_status = exports.paymentCommitController.rtn_status === 200 ? 503 : exports.paymentCommitController.rtn_status;
                yield payment_commit_service_1.paymentCommitService.rollbackTransaction();
                yield payment_commit_service_1.paymentCommitService.endTransaction();
                return res.status(exports.paymentCommitController.rtn_status).send({ message: err.toString().replace(/Error: /g, '') });
            }
            exports.paymentCommitController.rtn_status = 200;
            let rtn_message = { message: `${regsGrabados} registro/s grabados` };
            if (insertValues === '') {
                payment_commit_service_1.paymentCommitService.commitTransaction();
            }
            else {
                yield exports.paymentCommitController.sendMissingPyc(insertValues)
                    .then((data) => {
                    regsGrabados += data;
                    rtn_message = { message: `${regsGrabados} registro/s grabados` };
                    payment_commit_service_1.paymentCommitService.commitTransaction();
                })
                    .catch(err => {
                    payment_commit_service_1.paymentCommitService.rollbackTransaction();
                    exports.paymentCommitController.rtn_status = 503;
                    rtn_message = { message: `HTG-012(E): SQL error: ${err}` };
                });
            }
            payment_commit_service_1.paymentCommitService.endTransaction();
            error_logs_service_1.errorLogsService.addError('missing_payment_commit', rtn_message.message, 'nocode', 0);
            console.log('*** FIN:', exports.paymentCommitController.rtn_status, rtn_message);
            return res.status(exports.paymentCommitController.rtn_status).send(rtn_message);
        });
    }
    sendMissingPyc(valuesCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (valuesCmd !== '') {
                const sqlCmd = `INSERT INTO Datalake.payment_commit (user_id, status, access_until, method_name, source, amount, payment_type` +
                    `,duration, message, event, timestamp, user_agent, discount, payment_id, is_suscription, package, trial, trial_duration)` +
                    ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
                return yield payment_commit_service_1.paymentCommitService.insertMissingPyc(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return data.affectedRows;
                })
                    .catch(err => {
                    error_logs_service_1.errorLogsService.addError('missing_payment_commit', err.toString().substring(0, 4000), 'nocode', 0)
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
            const fileUpload = req.files.uploadPyc;
            const filename = `pyc_${moment_1.default().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
            return yield fileUpload.mv(`${environment_settings_1.STATIC_PATH}/uploads/${filename}`)
                .then(() => filename)
                .catch((err) => Promise.reject(err));
        });
    }
}
exports.paymentCommitController = new PaymentCommitController();
