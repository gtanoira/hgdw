import { Request, Response } from 'express';
import moment, { Moment } from 'moment';

// Models
import { TitleMetadataPublished } from '../models/title-metadata-published.model';

// Services
import { titlesService } from '../services/titles.service';
import { errorLogsService } from '../services/error-logs.service';
import { isNull } from 'util';

class TitlesController {

  private rtn_status = 400; // bad request

  // Insertar los register históricos en la tabla history_register
  public async publishTitles(req: Request, res: Response): Promise<any> {

    /*
      El proceso consiste en generar in INSERT INTO ... VALUES (...) masivo.
      Por lo que se utiliza el INSERT bulk, que consiste en una instrucción INSERT INTO y
      1000 instrucciones VALUES (...).
      De esta forma se acelera enormemente la carga de los titulos.
      Se usa 1000 VALUES, para que el string que se genera con el comando completo del SQL 
      no supere la capacidad máxima que permite el MySql como límite de una instrucción SQL.
    */

    // Inicializar variables
    let sqlValues = '';
    let titulosActualizados = 0;
    const timestamp = moment();  // default timestamp que se grabará en todos los titulos
    let titles: TitleMetadataPublished[] = [];

    // Validar que el body sea un JSON válido
    /* try {
      console.log('*** PASO 1');
      const body = JSON.parse(req.body);
    } catch (error) {
      console.log(error);
      return res.status(400).send({message: `HTG-010(E): el body (JSON) es incorrecto: ${error.toString().replace("Error: ", '')}`});
    } */

    // Validar que el JSON sea según el modelo necesario
    try {
      titles = req.body;
    } catch (error) {
      return res.status(400).send({message: 'el JSON enviado no corresponde con la estructura correcta.'});
    }

    try {
      // Leer los titulos a importar del BODY
      titulosActualizados = titles.length;

      await titlesService.startTransaction();
      
      for (let i = 0; i < titles.length; i++) {

        // Ejecutar el comando SQL si llegó a las 1000 iteraciones
        if ( i > 0 && i % 1000 === 0) {

          // Ejecutar el insert 
          await titlesController.sendTitles(sqlValues)
          .then(data => data)
          .catch(err => { 
            titlesController.rtn_status = 503; // service unavailable
            throw new Error(`HTG-012(E): SQL error: ${err.sqlMessage.toString()}`); 
          });

          // Reinicializar
          sqlValues = '';
        };

        // Validar y normalizar el titulo
        const title = titlesController.validateTitle(titles[i]);

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
          `,${title.seasonNo}`  +
          `${title.episodeSummary === null ? `,null` : `,'${title.episodeSummary}'`}` +
          `${title.categories === null ? `,null` : `,'${title.categories}'`}` +
          `,'${title.publishedDate}'` +
          `,'${timestamp.format('YYYY-MM-DD HH:mm:ss')}'),`;

          // Chequear que existan todos los campos
          if (sqlValues.indexOf('undefined') > 0) {
            throw new Error(`HTG-011(E): validando el assetId ${title.assetId}: faltan 1 o más campos.`);
          }
      };

    } catch (err) {
      await titlesService.rollbackTransaction();  // Rollback toda la transaccion
      await titlesService.endTransaction(); // finalizar la transacción      
      return res.status(titlesController.rtn_status).send({message: err.toString().replace(/Error: /g, '')});
    }

    // Mensaje de retorno
    titlesController.rtn_status = 200;  //ok
    let rtn_message = {message:`'Proceso finalizado. Se actualizaron ${titulosActualizados ? titulosActualizados : 0} titulos.'`};

    // Procesar los últimos titulos
    if (sqlValues === '') {
      titlesService.commitTransaction();  // Commit toda la transaccion

    } else {

      // Grabar los últimos titulos
      await titlesController.sendTitles(sqlValues)
      .then(data => {
        titlesService.commitTransaction();  // Commit toda la transaccion
      })
      .catch(err => {
        titlesService.rollbackTransaction();  // Rollback toda la transaccion
        titlesController.rtn_status = 503;  // service unavailable
        rtn_message = {message: `HTG-012(E): SQL error: ${err.sqlMessage.toString()}`};
      });
    };

    // Liberar la transacción
    titlesService.endTransaction();
    
    // Retornar el resultado
    return res.status(titlesController.rtn_status).send(rtn_message);
  }

  // Validar que los datos del titulo sean correctos y normalizarlos
  private validateTitle(oldTitle: TitleMetadataPublished): TitleMetadataPublished {

    const newTitle = oldTitle;  // new TitleMetadataPublished();
    // URL RegExp
    const regExpUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+(jpg|jpeg|png|gif|tiff)$/;

    try {

      // Asset Id
      if (!oldTitle.assetId) {
        throw new Error(`El campo assetId es obligatorio.`);
      } else if (oldTitle.assetId === null || oldTitle.assetId === '')  {
        throw new Error(`El campo assetId no puede ser null o vacío.`);
      };

      // Title Id
      if (oldTitle.titleId === undefined || oldTitle.titleId === null || oldTitle.titleId === '') {
        throw new Error(`El campo titleId es obligatorio y no puede ser null o vacío.`);
      } else {
        newTitle.titleId = oldTitle.titleId === null  ? null : oldTitle.titleId!.toUpperCase();
      };

      // Title Name
      if (!oldTitle.titleName) {
        newTitle.titleName = null;
      };

      // Title Type
      if (!oldTitle.titleType || oldTitle.titleType === null || oldTitle.titleType === '') {
        throw new Error(`El campo titleType es obligatorio, no puede ser null ni vacío.`);
      } else {
        newTitle.titleType = oldTitle.titleType!.toLowerCase();
      };

      // Title Summary
      if (!oldTitle.titleSummary) {
        newTitle.titleSummary = null;
      };

      // Title Active
      if (oldTitle.titleActive === undefined) {
        throw new Error(`El campo titleActive es obligatorio.`);
      } else {
        const ptitleActive = oldTitle.titleActive === null ? 0 : oldTitle.titleActive;
        if (ptitleActive < 0 || ptitleActive > 1) {
          throw new Error(`El campo titleActive debe ser 0 o 1.`);            
        } else {
          newTitle.titleActive = ptitleActive;
        };
      };

      // Titles URL
      if (oldTitle.titleUrlImagePortrait === undefined) {
        newTitle.titleUrlImagePortrait = null;
      } else if (oldTitle.titleUrlImagePortrait !== null) {
        if (!regExpUrl.test(oldTitle.titleUrlImagePortrait)) {
          throw new Error(`El URI del campo titleUrlImagePortrait es incorrecto.`);
        };
      };
      if (oldTitle.titleUrlImageLandscape === undefined) {
        newTitle.titleUrlImageLandscape = null;
      } else if (oldTitle.titleUrlImageLandscape !== null) {
        if (!regExpUrl.test(oldTitle.titleUrlImageLandscape)) {
          throw new Error(`El URI del campo titleUrlImageLandscape es incorrecto.`);
        };
      };

      // Brand Id
      if (!oldTitle.brandId) {
        newTitle.brandId = null;
      } else {
        if (newTitle.brandId !== null) {
          let newBrand = '';
          newTitle.brandId.split(' ').forEach(word => {
            newBrand += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + ' ';
          });
          newTitle.brandId = newBrand.trim();
        };
      };

      // Asset Active
      if (oldTitle.assetActive === undefined) {
        throw new Error(`El campo assetActive es obligatorio.`);
      } else {
        const passetActive = oldTitle.assetActive === null ? 0 : oldTitle.assetActive;
        if (passetActive < 0 || passetActive > 1) {
          throw new Error(`El campo assetActive debe ser 0 o 1.`);            
        } else {
          newTitle.assetActive = passetActive;
        };
      };

      // Asset Type
      if (oldTitle.assetType === undefined || oldTitle.assetType === null || oldTitle.assetType === '') {
        throw new Error(`El campo assetType es obligatorio, no puede ser null ni vacío.`);
      } else {
        newTitle.assetType = oldTitle.assetType!.toLowerCase();
      };

      // Assets URL
      if (oldTitle.assetUrlImagePortrait === undefined) {
        newTitle.assetUrlImagePortrait = null;
      } else if (oldTitle.assetUrlImagePortrait !== null) {
        if (!regExpUrl.test(oldTitle.assetUrlImagePortrait)) {
          throw new Error(`El URI del campo assetUrlImagePortrait es incorrecto.`);
        };
      };
      if (oldTitle.assetUrlImageLandscape === undefined) {
        newTitle.assetUrlImageLandscape = null;
      } else if (oldTitle.assetUrlImageLandscape !== null) {
        if (!regExpUrl.test(oldTitle.assetUrlImageLandscape)) {
          throw new Error(`El URI del campo assetUrlImageLandscape es incorrecto.`);
        };
      };

      // Episode Summary
      if (!oldTitle.episodeSummary) {
        newTitle.episodeSummary = null;
      };

      // Categories
      if (!oldTitle.categories) {
        newTitle.categories = null;
      };

      // Published Date
      if (!oldTitle.publishedDate) {
        newTitle.publishedDate = null;
      };
      
    } catch(err) {
      titlesController.rtn_status = 400; // bad request
      throw new Error(`HTG-011(E): validando el assetId ${oldTitle.assetId}: ${err.toString()}`);
    };

    return newTitle;
  };

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendTitles(sqlValues: string): Promise<any> {
    if (sqlValues !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO titles_metadata_published (title_id, title_name, title_summary, title_type`
        + `, title_active, title_url_image_portrait, title_url_image_landscape, brand_id, asset_id`
        + `, asset_active, asset_type, asset_url_image_portrait, asset_url_image_landscape, episode_no`
        + `, season_no, episode_summary, categories, published_date, timestamp) `
        + `VALUES ${sqlValues.substring(0, sqlValues.length - 1)};`;
      return await titlesService.insertPublishedTitles(sqlCmd)
      .then( data => { 
        console.log('Proceso Ok:', data.affectedRows, ' - ', data.message);
        return data;
      })
      .catch( err => {
        // Guardar el error en la base de datos
        errorLogsService.addError('publish_title', err.sqlMessage.toString().substring(0, 4000), 'nocode', 0)
        .then(data => null )
        .catch(err => err );
        return Promise.reject(err);
      });
    };
    return;
  }

}

export const titlesController = new TitlesController();