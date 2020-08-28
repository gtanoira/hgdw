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
exports.titlesController = void 0;
const moment_1 = __importDefault(require("moment"));
const titles_service_1 = require("../services/titles.service");
const error_logs_service_1 = require("../services/error-logs.service");
class TitlesController {
    constructor() {
        this.rtn_status = 400;
    }
    publishTitles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let sqlValues = '';
            let titulosActualizados = 0;
            const timestamp = moment_1.default();
            try {
                const titles = req.body;
                titulosActualizados = titles.length;
                yield titles_service_1.titlesService.startTransaction();
                for (let i = 0; i < titles.length; i++) {
                    if (i > 0 && i % 2 === 0) {
                        console.log('*** i:', i);
                        yield exports.titlesController.sendTitles(sqlValues)
                            .then(data => data)
                            .catch(err => {
                            exports.titlesController.rtn_status = 503;
                            throw new Error(`SqlError: ${err.sqlMessage}`);
                        });
                        sqlValues = '';
                    }
                    ;
                    const title = exports.titlesController.validateTitle(titles[i]);
                    sqlValues += `('${title.titleId}','${title.titleName}','${title.titleType}',${title.titleActive}`
                        + `,'${title.brandId}','${title.assetId}',${title.episodeActive},'${title.episodeType}'`
                        + `,'${title.episodeNo}','${title.categories}','${title.publishedDate}', '${timestamp.format('YYYY-MM-DD HH:mm:ss')}'),`;
                }
                ;
            }
            catch (err) {
                console.log('*** PUBLISH()');
                console.log(err);
                yield titles_service_1.titlesService.rollbackTransaction();
                yield titles_service_1.titlesService.endTransaction();
                return res.status(exports.titlesController.rtn_status).send({ message: err.toString().replace("Error: ", '') });
            }
            exports.titlesController.rtn_status = 200;
            let rtn_message = { message: `'Proceso finalizado. Se actualizaron ${titulosActualizados ? titulosActualizados : 0} titulos.'` };
            if (sqlValues === '') {
                titles_service_1.titlesService.commitTransaction();
            }
            else {
                yield exports.titlesController.sendTitles(sqlValues)
                    .then(data => {
                    titles_service_1.titlesService.commitTransaction();
                })
                    .catch(err => {
                    titles_service_1.titlesService.rollbackTransaction();
                    exports.titlesController.rtn_status = 503;
                    rtn_message = { message: `SqlError: ${err.sqlMessage.toString()}` };
                });
            }
            ;
            titles_service_1.titlesService.endTransaction();
            return res.status(exports.titlesController.rtn_status).send(rtn_message);
        });
    }
    validateTitle(oldTitle) {
        var _a, _b, _c;
        const newTitle = oldTitle;
        try {
            newTitle.titleId = (_a = oldTitle.titleId) === null || _a === void 0 ? void 0 : _a.toUpperCase();
            newTitle.titleType = (_b = oldTitle.titleType) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            const ptitleActive = oldTitle.titleActive.valueOf();
            if (ptitleActive < 0 || ptitleActive > 1) {
                throw new Error(`El campo titleActive es incorrecto (assetId: ${oldTitle.assetId}).`);
            }
            else {
                newTitle.titleActive = ptitleActive;
            }
            ;
            if (newTitle.brandId) {
                newTitle.brandId = newTitle.brandId.charAt(0).toUpperCase() + newTitle.brandId.substring(1).toLowerCase();
            }
            ;
            const pepisodeActive = oldTitle.episodeActive.valueOf();
            if (pepisodeActive < 0 || pepisodeActive > 1) {
                throw new Error(`El campo episodeActive es incorrecto (assetId: ${oldTitle.assetId}).`);
            }
            else {
                newTitle.episodeActive = pepisodeActive;
            }
            ;
            newTitle.episodeType = (_c = oldTitle.episodeType) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        }
        catch (err) {
            exports.titlesController.rtn_status = 400;
            throw new Error(err);
        }
        ;
        return newTitle;
    }
    ;
    sendTitles(sqlValues) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sqlValues !== '') {
                const sqlCmd = `INSERT INTO titles_metadata_published (title_id, title_name, title_type, title_active, `
                    + `brand_id, asset_id, episode_active, episode_type, episode_no, categories, published_date, timestamp) `
                    + `VALUES ${sqlValues.substring(0, sqlValues.length - 1)};`;
                return yield titles_service_1.titlesService.insertPublishedTitles(sqlCmd)
                    .then(data => {
                    console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
                    return data;
                })
                    .catch(err => {
                    error_logs_service_1.errorLogsService.addError('publish_title', err.sqlMessage.toString().substring(0, 4000), 'nocode', 0)
                        .then(data => null)
                        .catch(err => err);
                    return Promise.reject(err);
                });
            }
            ;
            return;
        });
    }
}
exports.titlesController = new TitlesController();
