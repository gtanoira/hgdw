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
exports.userCollectionsController = void 0;
const moment_1 = __importDefault(require("moment"));
const xlsx_1 = __importDefault(require("xlsx"));
;
const user_collections_service_1 = require("../services/user_collections.service");
const error_logs_service_1 = require("../services/error-logs.service");
class UserCollectionsController {
    InsertPaymentCommitHistory(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;
            const workbook = xlsx_1.default.readFile('src/public/downloads/history_user_collections.xlsx');
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const registers = xlsx_1.default.utils.sheet_to_json(worksheet);
            let insertValues = '';
            let cantReg = 0;
            for (let i = 0; i < registers.length; i++) {
                if (cantReg > 0 && cantReg % 1000 === 0) {
                    console.log('*** i:', i);
                    yield exports.userCollectionsController.sendPaymentCommitHistoryData(insertValues);
                    insertValues = '';
                    cantReg = 0;
                }
                ;
                try {
                    const register = registers[i];
                    if (register.event === 'payment_commit') {
                        const puserId = register.user_id ? register.user_id : 'no user';
                        const pevent = register.event ? register.event : 'register';
                        let ptimestamp = (_a = register.timestamp) === null || _a === void 0 ? void 0 : _a.toString();
                        if (regExpTimestamp.test(ptimestamp)) {
                            ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
                                return args[4] + '/' + args[2].padStart(2, '0') + '/' + args[3].padStart(2, '0') + ' ' + args[5] + ' ' + args[6];
                            });
                        }
                        ;
                        const pstatus = register.status ? register.status : '';
                        const pmethodName = register.method_name ? register.method_name : '';
                        const psource = register.source ? register.source : '';
                        const ppaymentType = register.payment_type ? register.payment_type : '';
                        const pduration = register.duration ? register.duration : 0;
                        const ptrial = register.trial ? register.trial : 0;
                        const pcurrency = register.currency ? register.currency : '';
                        const ptaxableAmount = register.taxable_amount ? register.taxable_amount : 0;
                        const pvatAmount = register.vat_amount ? register.vat_amount : 0;
                        const pamount = register.amount ? register.amount : 0;
                        const pdiscount = register.discount ? register.discount : 0;
                        const puserPaymentId = register.user_payment_id ? register.user_payment_id : '';
                        const accessUntil = moment_1.default(ptimestamp, 'YYYY/MM/DD HH:mm:ss').add(pduration, 'days');
                        const paccessUntil = accessUntil.format('YYYY/MM/DD HH:mm:ss');
                        insertValues += `('${puserId}','${pevent}','${ptimestamp}','${pstatus}','${paccessUntil}','${pmethodName}'`
                            + `,'${psource}','${ppaymentType}',${1},${pduration},${ptrial},'${pcurrency}',${ptaxableAmount},${pvatAmount}`
                            + `,${pamount},${pdiscount},'${puserPaymentId}'),`;
                        cantReg += 1;
                    }
                    ;
                }
                catch (error) {
                    console.log('*** Error reg: ', i);
                    console.log(error);
                }
            }
            yield exports.userCollectionsController.sendPaymentCommitHistoryData(insertValues);
            console.log('*** FIN PROCESO history_payment_commit ***');
            return res.send('Proceso finalizado').status(200);
        });
    }
    InsertRebillHistory(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const regExpTimestamp = /((\d{1,2})\/(\d{1,2})\/(\d{4})) (.*) (AM|am|PM|pm)/gm;
            const workbook = xlsx_1.default.readFile('src/public/downloads/history_user_collections.xlsx');
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const registers = xlsx_1.default.utils.sheet_to_json(worksheet);
            let insertValues = '';
            let cantReg = 0;
            for (let i = 0; i < registers.length; i++) {
                if (cantReg > 0 && cantReg % 1000 === 0) {
                    console.log('*** i:', i);
                    yield exports.userCollectionsController.sendRebillHistoryData(insertValues);
                    insertValues = '';
                    cantReg = 0;
                }
                ;
                try {
                    const register = registers[i];
                    if (register.event === 'rebill') {
                        const puserId = register.user_id ? register.user_id : 'no user';
                        const pevent = register.event ? register.event : 'register';
                        let ptimestamp = (_a = register.timestamp) === null || _a === void 0 ? void 0 : _a.toString();
                        if (regExpTimestamp.test(ptimestamp)) {
                            ptimestamp = ptimestamp.replace(regExpTimestamp, (...args) => {
                                return args[4] + '/' + args[2].padStart(2, '0') + '/' + args[3].padStart(2, '0') + ' ' + args[5] + ' ' + args[6];
                            });
                        }
                        ;
                        const pstatus = register.status ? register.status : '';
                        const pmethodName = register.method_name ? register.method_name : '';
                        const psource = register.source ? register.source : '';
                        const ppaymentType = register.payment_type ? register.payment_type : '';
                        const pduration = register.duration ? register.duration : 0;
                        const ptrial = register.trial ? register.trial : 0;
                        const pcurrency = register.currency ? register.currency : '';
                        const ptaxableAmount = register.taxable_amount ? register.taxable_amount : 0;
                        const pvatAmount = register.vat_amount ? register.vat_amount : 0;
                        const pamount = register.amount ? register.amount : 0;
                        const pdiscount = register.discount ? register.discount : 0;
                        const puserPaymentId = register.user_payment_id ? register.user_payment_id : '';
                        const accessUntil = moment_1.default(ptimestamp, 'YYYY/MM/DD HH:mm:ss').add(pduration, 'days');
                        const paccessUntil = accessUntil.format('YYYY/MM/DD HH:mm:ss');
                        insertValues += `('${puserId}','${pevent}','${ptimestamp}','${pstatus}','${paccessUntil}','${pmethodName}'`
                            + `,'${psource}','${ppaymentType}',${pduration},${ptrial},'${pcurrency}',${ptaxableAmount},${pvatAmount}`
                            + `,${pamount},${pdiscount},'${puserPaymentId}'),`;
                        cantReg += 1;
                    }
                    ;
                }
                catch (error) {
                    console.log('*** Error reg: ', i);
                    console.log(error);
                }
            }
            yield exports.userCollectionsController.sendRebillHistoryData(insertValues);
            console.log('*** FIN PROCESO history_rebill ***');
            return res.send('Proceso finalizado').status(200);
        });
    }
    sendPaymentCommitHistoryData(valuesCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (valuesCmd !== '') {
                const sqlCmd = `INSERT INTO history_payment_commit (user_id, event, timestamp, status, access_until, method_name, source, `
                    + `payment_type, is_suscription, duration, trial, currency, taxable_amount, vat_amount, amount, discount, user_payment_id) `
                    + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
                return yield user_collections_service_1.userCollectionsService.insertPaymentCommitHistory(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return;
                })
                    .catch(err => {
                    console.log('ERROR: ', err);
                    error_logs_service_1.errorLogsService.addError('history_payment_commit', err.toString().substring(1, 4000), 'nocode', 0)
                        .then(data => null)
                        .catch(err => null);
                    return;
                });
            }
            ;
            return;
        });
    }
    sendRebillHistoryData(valuesCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (valuesCmd !== '') {
                const sqlCmd = `INSERT INTO history_rebill (user_id, event, timestamp, status, access_until, method_name, source, `
                    + `rebill_type, duration, trial, currency, taxable_amount, vat_amount, amount, discount, user_payment_id) `
                    + `VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
                return yield user_collections_service_1.userCollectionsService.insertRebillHistory(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return;
                })
                    .catch(err => {
                    console.log('ERROR: ', err);
                    error_logs_service_1.errorLogsService.addError('history_rebill', err.toString().substring(1, 4000), 'nocode', 0)
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
exports.userCollectionsController = new UserCollectionsController();
