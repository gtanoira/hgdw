import axios from 'axios';

// Environment
import { LOGIN_CENTRAL_SERVER } from '../settings/environment.settings';

class AuthorizationService {

  private http = axios;

  public async isTokenValid(token: string): Promise<boolean> {
    
    return await this.http.get<boolean>(`${LOGIN_CENTRAL_SERVER}/api2/validatesession`, {
      headers: {
        Authorization: token
      }
    })
    .then( () => { return true; } )
    .catch(() => { return false; } );
  }

}

export const authorizationService = new AuthorizationService();