import * as axios from 'axios';

// Environment
import { LOGIN_CENTRAL_SERVER } from '../settings/environment.settings';

class AuthorizationService {

  private http = axios.default;

  public async isTokenValid(token: string): Promise<Boolean> {
    
    return await this.http.get<Boolean>(`${LOGIN_CENTRAL_SERVER}/api2/validatesession`, {
      headers: {
        Authorization: token
      }
    })
    .then( (response) => { return true; } )
    .catch((response) => { return false; } );
  }

}

export const authorizationService = new AuthorizationService();