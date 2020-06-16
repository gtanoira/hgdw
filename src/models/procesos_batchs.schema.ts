/*
   Todas estas ayudas se encuentran en: node_modules/typeorm/entity-schema/*
   Ayuda para schema options: EntitySchemaOptions.d.ts
   Ayuda para entity columns: EntitySchemaColumnOptions.d.ts
   etc...
*/
import { EntitySchema } from "typeorm";

export interface ProcesosBatchModel {
  id: number;
  ultimoTimestampLote: string;
  tabla: string;
  resultado?: string;
  idFk: number;
  altaDate: string;
  altaUser?: string;
}

export const ProcesosBatchsSchema = new EntitySchema<ProcesosBatchModel>({
  name: "ProcesosBatch",
  tableName: "procesos_batchs",
  database: "DWHBP",
  synchronize: false,   // no incluir en migrations
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
  },
  indices: [
    {
      name: "idx_01_procesos_batchs",
      unique: true,
      columns: [
        "tabla",
        "altaDate"
      ]
    }
  ],
});