import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';


var TOKEN: string = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYmFua3Zpc2lvbiJdLCJ1c2VyX25hbWUiOiJCVlMiLCJzY29wZSI6WyJ0cnVzdCIsInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE2ODQ1OTQxMjgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJqdGkiOiJiMzJjNTUwYi04Mzc3LTQ5ZDctYjdkNy1mZDJkMDA3ZWNmZWQiLCJjbGllbnRfaWQiOiJiYW5rdmlzaW9uIn0.1qFeYH3gF3yWrfm191fZlV5yn4H92yTM8ABdwmuWWH7gvSaaFArjP3e4mXrOoNcKgJhwI5eMwWVTtaCcefZ5bm2qqdlnv1wNSUzQr97Sdo3O3SL1KLOegS0ANSQia7jLrOxXPynl-_fc0i4pMykTXwlTL_5PfmuTw_uMImxWabVgggd70NBpgUdimb_fK6NzZty__78E5VtkuFtfcpnZw9LyXRlSdrhsUQuzQ_F4JeV4Jj4pyu-psG7mrVM9e6JnpJtoJU73Z1uvnb4dU87u31OU5mIThD9qkmcdIpV1feNwh9b27bDd9iZZbX1Dftj43JfukwfIV9CWHj3oFulTzg';
const sigla = "JRS";
var httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + TOKEN
  })
}
var httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + TOKEN
  })
}
sessionStorage.setItem("token" + sigla, 'Bearer ' + TOKEN);
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  HttpUrl: any = environment.HttpUrl;
  constructor(private http: HttpClient, private tokenServ: TokenService) {
    sessionStorage.setItem("token" + sigla, 'Bearer ' + TOKEN);
    this.getHttpOptions();
   }

   async setToken(_callback: any) {
    
    await this.tokenServ.getToken(sigla, (result: string) => {
      httpOptions.headers = new HttpHeaders({
        Authorization: `Bearer ${result}`
      });
      TOKEN = 'Bearer ' + result;
      sessionStorage.setItem("token" + sigla, result);
      _callback();
    });
  }

  getHttpOptions() {
    this.setToken((res:any) => {}).then(() => {
      return httpOptions;
    });
    // } 
    return httpOptions;
  }

  faceComparison(data:any) {
    return this.http.post(`${this.HttpUrl}biometric-validation/face-comparison`, data, this.getHttpOptions())
  }
  documentReading(data:any) {
    return this.http.post(`${this.HttpUrl}biometric-validation/document-reading`, data, this.getHttpOptions())
  }
}
