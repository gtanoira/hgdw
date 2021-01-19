import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { google }  from 'googleapis';
import { JWT } from 'google-auth-library';
import { GoogleAuth } from 'google-auth-library';
import { getConnection } from 'typeorm';

// Environment
import gan from '../settings/HGDW-97ad94690664.json';
// Models & Interfaces
interface GAOptions {
  ids: string,
  'start-date': string,
  'end-date': string,
  metrics?: string,
  dimensions?: string,
  sort?: string,
  filters?: string,
  segment?: string,
  'start-index'?: number,
  'max-results'?: number
 }

class GoogleAnalyticsService {
  
  // Instanciar librerías
  private http = axios;
  private jwt = jsonwebtoken;
  
  // Google Analytics credentials
  private googleApis = google;
  private analytics = google.analytics('v3');
  private accountId = '47530604';  // GA account (Claxson)
  private webPropertyId = 'UA-47530604-2';  // GA Property (Claxson - HotGo.tv)
  private profileId = '156035551';  // GA view Id (1 - HotGo.tv View Master)

  // Acceso a través de GoogleAuth  via JWT
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getView3(): Promise<any> {

    const scopes = [
      'https://www.googleapis.com/auth/analytics',
      'https://www.googleapis.com/auth/analytics.readonly'
    ];

    const jwtServiceAccount = new JWT({
      email: gan.client_email,
      key: gan.private_key,
      scopes
    });

    const gauthServiceAccount = new GoogleAuth({
      clientOptions: jwtServiceAccount
    });

    /* const url = `https://dns.googleapis.com/dns/v1/projects/${gan.project_id}`;
    const res = await serviceAccount.request({url});
    console.log('*** SERVICE ACCOUNT:');
    console.log(res.data); */

    return jwtServiceAccount.authorize( (err, result) => {

        // Obtener la vista
        const view_id = '156035551';

        this.googleApis.options({auth: jwtServiceAccount});
        this.analytics.data.ga.get(
          {
            ids: `ga:${ view_id }`,
            'start-date': '7daysAgo',
            'end-date': 'today',
            metrics: 'ga:pageviews'
          }
        ).then(
          gaData => {
            console.log('*** GA DATA:');
            console.log(gaData);
            return gaData.data;
          }
        ).catch(
          err => {
            console.log(err);
            return err;
          }
        );
      }
    );
  }

  // Acceso a través de GoogleAuth via modo automático
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getView4(
    metrics: string, 
    dimensions: string, 
    fechaDesde: string, 
    fechaHasta: string, 
    filters: string,
    pageIndex = 1
  ): Promise<any> {

    /**
     * Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
     * this library will automatically choose the right client based on the environment.
     */
    const auth = new GoogleAuth({
      keyFilename: 'settings/HGDW-97ad94690664.json',
      projectId: gan.project_id,
      scopes: [
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.readonly',
      ]
    });

    const view_id = '156035551';
    // Armar el objeto OPTIONS para la API de GA
    const gaOptions: GAOptions = {
      ids: `ga:${ view_id }`,
      'start-date': fechaDesde,
      'end-date': fechaHasta,
      'max-results': 10000,
      'start-index': (pageIndex < 1) ? 1 : (pageIndex - 1) * 10000 + 1
    };
    // Agregar las métricas
    if (metrics) { 
      gaOptions['metrics'] = metrics;
    } else { 
      gaOptions['metrics'] = 'ga:sessions';
    }
    // Agregar las dimensiones
    if (dimensions) { gaOptions['dimensions'] = dimensions; }
    // Agregar los filtros
    if (filters && filters !== '') { gaOptions['filters'] = filters; }

    this.googleApis.options({auth: auth});
    return await this.analytics.data.ga.get(
      gaOptions
    ).then(
      gaData => {
        return gaData.data;
      }
    ).catch( err => {
      console.log('** GA ERROR:');
      console.log(err);
      return Promise.reject(err.errors[0].message);
    });

  }

  // Save users 1st. sessions into MySql Datawarehouse in AWS
  public async save1stSessionsToMySql(data: []): Promise<number> {
    // Mysql maximum packet size = 4194304  (SHOW VARIABLES LIKE 'max_allowed_packet';)
    // El insert se hace del tipo BULK (masivo) de 4000 registros por vez, o sea 1 INSERT con 4000 VALUES

    // Establecer la conexión con el AWS Datalake
    const connection = getConnection('HGDW');
      
    // Variables
    let regsGrabados = 0;
    let valuesCmd = '';
    const sqlCmd = (valuesCmd: string): string => {
      return `INSERT INTO ga_first_users_sessions (user_id, timestamp, channel_grouping, source, medium, campaign, ad_content)`+
      ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
    };      

    for (let i = 0; i < data.length; i++) {

      // Ejecutar el comando SQL si llegó a las 4000 iteraciones
      if ( i > 0 && i % 4000 === 0) {

        // Ejecutar el insert
        await connection.query(sqlCmd(valuesCmd))
        .then(data => { 
          regsGrabados = regsGrabados + data.affectedRows ;
        })
        .catch(err => { 
          throw Promise.reject({ message: `HTG-012(E): SQL error: ${err}` }); 
        });

        // Reinicializar
        valuesCmd = '';
      }

      // Leer un registro
      const userId: string = data[i][0];
      const timestamp: string = data[i][1];
      const channelGrouping: string = data[i][2];
      const source: string = data[i][3];
      const medium: string = data[i][4];
      const campaign: string = data[i][5];
      const adContent: string = data[i][6];
      // Preparar la fecha
      const fecha = timestamp.slice(0,4) + '-' + timestamp.slice(4, 6) + '-' + timestamp.slice(6, 8) +
        'T' + timestamp.slice(8, 10) + ':' + timestamp.slice(10, 12) + ':00Z';
      // Crear el VALUES del INSERT
      valuesCmd += `('${userId}','${fecha}','${channelGrouping}','${source}','${medium}'` +
        `,'${campaign}','${adContent}'),`;
    }

    // Procesar los últimos titulos
    if (valuesCmd !== '') {
      await connection.query(sqlCmd(valuesCmd))
      .then((data) => {
        regsGrabados = regsGrabados + data.affectedRows;
      })
      .catch(err => {
        return Promise.reject({ message: `HTG-012(E): SQL error: ${err}` });
      });
    }

    // Retornar el resultado
    return regsGrabados;
  }

  // Save users 1st. sessions into MySql Datawarehouse in AWS
  public async saveDailyTransactionsToMySql(data: []): Promise<number> {
    // Mysql maximum packet size = 4194304  (SHOW VARIABLES LIKE 'max_allowed_packet';)
    // El insert se hace del tipo BULK (masivo) de 4000 registros por vez, o sea 1 INSERT con 4000 VALUES

    // Establecer la conexión con el AWS Datalake
    const connection = getConnection('HGDW');
      
    // Variables
    let regsGrabados = 0;
    let valuesCmd = '';
    const sqlCmd = (valuesCmd: string): string => {
      return `INSERT INTO ga_users_payments (user_id, timestamp, transaction_id, channel_grouping, source, medium, campaign, currency_code, local_item_revenue)`+
      ` VALUES ${valuesCmd.substring(0, valuesCmd.length - 1)};`;
    };      

    for (let i = 0; i < data.length; i++) {

      // Ejecutar el comando SQL si llegó a las 4000 iteraciones
      if ( i > 0 && i % 4000 === 0) {

        // Ejecutar el insert
        await connection.query(sqlCmd(valuesCmd))
        .then(data => { 
          regsGrabados = regsGrabados + data.affectedRows ;
        })
        .catch(err => { 
          throw Promise.reject({ message: `HTG-012(E): SQL error: ${err}` }); 
        });

        // Reinicializar
        valuesCmd = '';
      }

      // Leer un registro
      const transactionId: string = data[i][0];
      const timestamp: string = data[i][1];
      const channelGrouping: string = data[i][2];
      const source: string = data[i][3];
      const medium: string = data[i][4];
      const campaign: string = data[i][5];
      const currencyCode: string = data[i][6];
      const localItemRevenue: string = data[i][7];
      // Obtener el userId
      const userId: string = transactionId.slice(14);
      // Obtener la fecha
      const fecha = timestamp.slice(0,4) + '-' + timestamp.slice(4, 6) + '-' + timestamp.slice(6, 8) +
        'T' + timestamp.slice(8, 10) + ':' + timestamp.slice(10, 12) + ':00Z';
      // Crear el VALUES del INSERT
      valuesCmd += `('${userId}','${fecha}','${transactionId}','${channelGrouping}','${source}','${medium}'` +
        `,'${campaign}','${currencyCode}',${localItemRevenue}),`;
    }

    // Procesar los últimos titulos
    if (valuesCmd !== '') {
      await connection.query(sqlCmd(valuesCmd))
      .then((data) => {
        regsGrabados = regsGrabados + data.affectedRows;
      })
      .catch(err => {
        return Promise.reject({ message: `HTG-012(E): SQL error: ${err}` });
      });
    }

    // Retornar el resultado
    return regsGrabados;
  }

}

export const googleAnalyticsService = new GoogleAnalyticsService();