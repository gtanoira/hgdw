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
            let titles = [];
            try {
                titles = req.body;
            }
            catch (error) {
                return res.status(400).send({ message: 'el JSON enviado no corresponde con la estructura correcta.' });
            }
            try {
                titulosActualizados = titles.length;
                yield titles_service_1.titlesService.startTransaction();
                for (let i = 0; i < titles.length; i++) {
                    if (i > 0 && i % 1000 === 0) {
                        yield exports.titlesController.sendTitles(sqlValues)
                            .then(data => data)
                            .catch(err => {
                            exports.titlesController.rtn_status = 503;
                            throw new Error(`HTG-012(E): SQL error: ${err.sqlMessage.toString()}`);
                        });
                        sqlValues = '';
                    }
                    ;
                    const title = exports.titlesController.validateTitle(titles[i]);
                    sqlValues += `('${title.titleId}'` +
                        `${title.titleName === null ? `,null` : `,'${title.titleName}'`}` +
                        `${title.titleSummary === null ? `,null` : `,'${title.titleSummary}'`}` +
                        `,'${title.titleType}'` +
                        `,${title.titleActive}` +
                        `${title.titleUrlImagePortrait === null ? `,null` : `,'${title.titleUrlImagePortrait}'`}` +
                        `${title.titleUrlImageLandscape === null ? `,null` : `,'${title.titleUrlImageLandscape}'`}` +
                        `,'${title.brandId}'` +
                        `,'${title.assetId}'` +
                        `,${title.assetActive}` +
                        `,'${title.assetType}'` +
                        `${title.assetUrlImagePortrait === null ? `,null` : `,'${title.assetUrlImagePortrait}'`}` +
                        `${title.assetUrlImageLandscape === null ? `,null` : `,'${title.assetUrlImageLandscape}'`}` +
                        `,${title.episodeNo}` +
                        `,${title.seasonNo}` +
                        `${title.episodeSummary === null ? `,null` : `,'${title.episodeSummary}'`}` +
                        `${title.categories === null ? `,null` : `,'${title.categories}'`}` +
                        `,'${title.publishedDate}'` +
                        `,'${timestamp.format('YYYY-MM-DD HH:mm:ss')}'),`;
                    if (sqlValues.indexOf('undefined') > 0) {
                        throw new Error(`HTG-011(E): validando el assetId ${title.assetId}: faltan 1 o más campos.`);
                    }
                }
                ;
            }
            catch (err) {
                yield titles_service_1.titlesService.rollbackTransaction();
                yield titles_service_1.titlesService.endTransaction();
                return res.status(exports.titlesController.rtn_status).send({ message: err.toString().replace(/Error: /g, '') });
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
                    rtn_message = { message: `HTG-012(E): SQL error: ${err.sqlMessage.toString()}` };
                });
            }
            ;
            titles_service_1.titlesService.endTransaction();
            return res.status(exports.titlesController.rtn_status).send(rtn_message);
        });
    }
    validateTitle(oldTitle) {
        const newTitle = oldTitle;
        const regExpUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+(jpg|jpeg|png|gif|tiff)$/;
        try {
            if (!oldTitle.assetId) {
                throw new Error(`El campo assetId es obligatorio.`);
            }
            else if (oldTitle.assetId === null || oldTitle.assetId === '') {
                throw new Error(`El campo assetId no puede ser null o vacío.`);
            }
            ;
            if (oldTitle.titleId === undefined || oldTitle.titleId === null || oldTitle.titleId === '') {
                throw new Error(`El campo titleId es obligatorio y no puede ser null o vacío.`);
            }
            else {
                newTitle.titleId = oldTitle.titleId === null ? null : oldTitle.titleId.toUpperCase();
            }
            ;
            if (!oldTitle.titleName) {
                newTitle.titleName = null;
            }
            ;
            if (!oldTitle.titleType || oldTitle.titleType === null || oldTitle.titleType === '') {
                throw new Error(`El campo titleType es obligatorio, no puede ser null ni vacío.`);
            }
            else {
                newTitle.titleType = oldTitle.titleType.toLowerCase();
            }
            ;
            if (!oldTitle.titleSummary) {
                newTitle.titleSummary = null;
            }
            ;
            if (oldTitle.titleActive === undefined) {
                throw new Error(`El campo titleActive es obligatorio.`);
            }
            else {
                const ptitleActive = oldTitle.titleActive === null ? 0 : oldTitle.titleActive;
                if (ptitleActive < 0 || ptitleActive > 1) {
                    throw new Error(`El campo titleActive debe ser 0 o 1.`);
                }
                else {
                    newTitle.titleActive = ptitleActive;
                }
                ;
            }
            ;
            if (oldTitle.titleUrlImagePortrait === undefined) {
                newTitle.titleUrlImagePortrait = null;
            }
            else if (oldTitle.titleUrlImagePortrait !== null) {
                if (!regExpUrl.test(oldTitle.titleUrlImagePortrait)) {
                    throw new Error(`El URI del campo titleUrlImagePortrait es incorrecto.`);
                }
                ;
            }
            ;
            if (oldTitle.titleUrlImageLandscape === undefined) {
                newTitle.titleUrlImageLandscape = null;
            }
            else if (oldTitle.titleUrlImageLandscape !== null) {
                if (!regExpUrl.test(oldTitle.titleUrlImageLandscape)) {
                    throw new Error(`El URI del campo titleUrlImageLandscape es incorrecto.`);
                }
                ;
            }
            ;
            if (!oldTitle.brandId) {
                newTitle.brandId = null;
            }
            else {
                if (newTitle.brandId !== null) {
                    let newBrand = '';
                    newTitle.brandId.split(' ').forEach(word => {
                        newBrand += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + ' ';
                    });
                    newTitle.brandId = newBrand.trim();
                }
                ;
            }
            ;
            if (oldTitle.assetActive === undefined) {
                throw new Error(`El campo assetActive es obligatorio.`);
            }
            else {
                const passetActive = oldTitle.assetActive === null ? 0 : oldTitle.assetActive;
                if (passetActive < 0 || passetActive > 1) {
                    throw new Error(`El campo assetActive debe ser 0 o 1.`);
                }
                else {
                    newTitle.assetActive = passetActive;
                }
                ;
            }
            ;
            if (oldTitle.assetType === undefined || oldTitle.assetType === null || oldTitle.assetType === '') {
                throw new Error(`El campo assetType es obligatorio, no puede ser null ni vacío.`);
            }
            else {
                newTitle.assetType = oldTitle.assetType.toLowerCase();
            }
            ;
            if (oldTitle.assetUrlImagePortrait === undefined) {
                newTitle.assetUrlImagePortrait = null;
            }
            else if (oldTitle.assetUrlImagePortrait !== null) {
                if (!regExpUrl.test(oldTitle.assetUrlImagePortrait)) {
                    throw new Error(`El URI del campo assetUrlImagePortrait es incorrecto.`);
                }
                ;
            }
            ;
            if (oldTitle.assetUrlImageLandscape === undefined) {
                newTitle.assetUrlImageLandscape = null;
            }
            else if (oldTitle.assetUrlImageLandscape !== null) {
                if (!regExpUrl.test(oldTitle.assetUrlImageLandscape)) {
                    throw new Error(`El URI del campo assetUrlImageLandscape es incorrecto.`);
                }
                ;
            }
            ;
            if (!oldTitle.episodeSummary) {
                newTitle.episodeSummary = null;
            }
            ;
            if (!oldTitle.categories) {
                newTitle.categories = null;
            }
            ;
            if (!oldTitle.publishedDate) {
                newTitle.publishedDate = null;
            }
            ;
        }
        catch (err) {
            exports.titlesController.rtn_status = 400;
            throw new Error(`HTG-011(E): validando el assetId ${oldTitle.assetId}: ${err.toString()}`);
        }
        ;
        return newTitle;
    }
    ;
    sendTitles(sqlValues) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sqlValues !== '') {
                const sqlCmd = `INSERT INTO titles_metadata_published (title_id, title_name, title_summary, title_type`
                    + `, title_active, title_url_image_portrait, title_url_image_landscape, brand_id, asset_id`
                    + `, asset_active, asset_type, asset_url_image_portrait, asset_url_image_landscape, episode_no`
                    + `, season_no, episode_summary, categories, published_date, timestamp) `
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
