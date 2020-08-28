import { Request, Response } from 'express';
import moment, { Moment } from 'moment';

// Models
import { TitleMetadataPublished } from '../models/title-metadata-published.model';

// Services
import { titlesService } from '../services/titles.service';
import { errorLogsService } from '../services/error-logs.service';

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

    try {
      // Leer los titulos a importar del BODY
      const titles: TitleMetadataPublished[] = req.body;
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
            throw new Error(`SqlError: ${err.sqlMessage}`); 
          });

          // Reinicializar
          sqlValues = '';
        };

        // Validar y normalizar el titulo
        const title = titlesController.validateTitle(titles[i]);
          
        sqlValues += `('${title.titleId}','${title.titleName}','${title.titleType}',${title.titleActive}`
          + `,'${title.brandId}','${title.assetId}',${title.episodeActive},'${title.episodeType}'`
          + `,'${title.episodeNo}','${title.categories}','${title.publishedDate}', '${timestamp.format('YYYY-MM-DD HH:mm:ss')}'),`;
      };

    } catch (err) {
      await titlesService.rollbackTransaction();  // Rollback toda la transaccion
      await titlesService.endTransaction(); // finalizar la transacción      
      return res.status(titlesController.rtn_status).send({message: err.toString().replace("Error: ", '')});
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
        rtn_message = {message: `SqlError: ${err.sqlMessage.toString()}`};
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

    try {
      
      newTitle.titleId = oldTitle.titleId?.toUpperCase();
      newTitle.titleType = oldTitle.titleType?.toLowerCase();
      const ptitleActive = oldTitle.titleActive.valueOf();
      if (ptitleActive < 0 || ptitleActive > 1) {
        throw new Error(`El campo titleActive es incorrecto (assetId: ${oldTitle.assetId}).`);            
      } else {
        newTitle.titleActive = ptitleActive;
      };
      if (newTitle.brandId) {
        newTitle.brandId = newTitle.brandId.charAt(0).toUpperCase() + newTitle.brandId.substring(1).toLowerCase();
      };
      const pepisodeActive = oldTitle.episodeActive.valueOf();
      if (pepisodeActive < 0 || pepisodeActive > 1) {
        throw new Error(`El campo episodeActive es incorrecto (assetId: ${oldTitle.assetId}).`);            
      } else {
        newTitle.episodeActive = pepisodeActive;
      };
      newTitle.episodeType = oldTitle.episodeType?.toLowerCase();

    } catch(err) {
      titlesController.rtn_status = 400; // bad request
      throw new Error(err);
    };

    return newTitle;
  };

  // Envía el comando SQL a ejecutarse a la base de datos
  private async sendTitles(sqlValues: string): Promise<any> {
    if (sqlValues !== '') {
      // Armar el comando Sql
      const sqlCmd = `INSERT INTO titles_metadata_published (title_id, title_name, title_type, title_active, `
        + `brand_id, asset_id, episode_active, episode_type, episode_no, categories, published_date, timestamp) `
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