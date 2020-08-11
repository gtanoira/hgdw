import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { google }  from 'googleapis';
import { JWT } from 'google-auth-library';

// Environment
import gan from '../settings/HGDW-97ad94690664.json';

class GoogleAnalyticsService {
  
  // Instanciar librerías
  private http = axios;
  private jwt = jsonwebtoken;
  
  // Google Service Accounts Credentials
  public authGaaS = new google.auth.GoogleAuth({
    keyFile: '../settings/HGDW-97ad94690664.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  // Google Analytics credentials
  private accountId = '47530604';  // GA account (Claxson)
  private webPropertyId = 'UA-47530604-2';  // GA Property (Claxson - HotGo.tv)
  private profileId = '156035551';  // GA view Id (1 - HotGo.tv View Master)

  // Google Cloud - API Key Credential (name HGDW)
  private apiKey = 'AIzaSyBpNaysW-uBN-IzLNLq5hiVjKaDzIDsl-4';
  
  // BigQuery API - View list
  private uri = `https://www.googleapis.com/analytics/v3/management/accounts/${this.accountId}/webproperties/${this.webPropertyId}/profiles/${this.profileId}?key=${this.apiKey}]`;
  
  // Authorization de prueba creada por OAuth2 algo.... (una de las tantas pruebas)
  private authorization = 'Bearer ya29.a0AfH6SMApjrDfEgEO61CitKJd7ar5knSu9RowGM-BQipWrAhK3kGpJo3ZSjUnflk1qHaZYQtNZP8m8cS9k-JA9Bva4ljiBqF1wJnNYatmLB6qZ49SZOS-ilxdK1B7OuaOPgyoujXzJ-3PWHmZrjSf0pnlyhaenPB8ejI';

  public async getView2(viewId: string): Promise<{}> {

    const token = this.createJwtToken();
    // const body = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`;
    const body = `urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`;

    return await this.http.post<{}>('https://oauth2.googleapis.com/token', body)
    .then(data => data)
    .catch( err => {
      console.log(err);
      return err;
    });
  }

  private async createJwtToken() {

    const jwtHeader = {"alg":"RS256","typ":"JWT"};

    const jwtClaimSet = {
      "iss": gan.client_email,
      "scope": "https://www.googleapis.com/auth/devstorage.read_only",
      "aud": "https://oauth2.googleapis.com/token",
      "exp": 1328554385,
      "iat": 1328550785
    };

    return this.jwt.sign(
      `${jwtHeader}.${jwtClaimSet}`,
      gan.private_key, { algorithm: 'RS256' },
      (err, token) => {
        console.log('*** token:', token);
        return token;
      }
    );
  }

  public async getView3(): Promise<void> {

    const scopes = [
      'https://www.googleapis.com/auth/analytics',
      'https://www.googleapis.com/auth/analytics.readonly',
    ];
      
    //  'https://www.googleapis.com/auth/analytics.readonly';

    const serviceAccount = new JWT({
      email: gan.client_email,
      key: gan.private_key,
      scopes
    });

    const url = `https://dns.googleapis.com/dns/v1/projects/${gan.project_id}`;
    const res = await serviceAccount.request({url});
    console.log('*** SERVICE ACCOUNT:');
    console.log(res.data);

    const view_id = '156035551';

    serviceAccount.authorize((err, response) => {
      google.analytics('v3').data.ga.get(
        {
          ids: `ga:${ view_id }`,
          'start-date': '30daysAgo',
          'end-date': 'today',
          metrics: 'ga:pageviews'
        },
        (err, result) => {
          console.log(err, result)
        }
      )
    })
    console.log('*** FIN');
  }

}

export const googleAnalyticsService = new GoogleAnalyticsService();