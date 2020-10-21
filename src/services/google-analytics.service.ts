import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { google }  from 'googleapis';
import { JWT } from 'google-auth-library';
import { GoogleAuth } from 'google-auth-library';

// Environment
import gan from '../settings/HGDW-97ad94690664.json';

// Models
interface GAOptions {
  ids: string,
  'start-date': string,
  'end-date': string,
  metrics?: string,
  dimensions?: string
 };

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
  public async getView4(metrics: string, dimensions: string): Promise<any> {

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
    const gaOptions: GAOptions = {
      ids: `ga:${ view_id }`,
      'start-date': '7daysAgo',
      'end-date': 'today'
    };
    if (metrics) { 
      gaOptions['metrics'] = metrics;
    } else { 
      gaOptions['metrics'] = 'ga:sessions';
    }
    if (dimensions) { gaOptions['dimensions'] = dimensions; }

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

}

export const googleAnalyticsService = new GoogleAnalyticsService();