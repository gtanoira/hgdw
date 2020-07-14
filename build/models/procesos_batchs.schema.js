"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesosBatchsSchema = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
exports.ProcesosBatchsSchema = new typeorm_1.EntitySchema({
    name: "ProcesosBatch",
    tableName: "procesos_batchs",
    database: environment_settings_1.AWS_DBASE,
    synchronize: false,
    columns: {
        id: {
            primary: true,
            type: "int",
            nullable: false
        },
        ultimoTimestampLote: {
            name: "ultimo_timestamp_lote",
            type: "timestamp"
        },
        tabla: {
            type: String,
            length: 255
        },
        resultado: {
            type: String,
            length: 1000
        },
        idFk: {
            name: "id_fk",
            type: "int",
            nullable: false
        },
        altaDate: {
            name: "alta_date",
            type: "timestamp",
            createDate: true
        },
        altaUser: {
            name: "alta_user",
            type: String,
            length: 255
        }
    }
});
