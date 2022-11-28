import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

var headers_object = new HttpHeaders();
headers_object.append("Authorization", "Basic " + btoa("bankvision:bankvision"));
var httpOptions = {
  //headers: headers_object
  headers: new HttpHeaders({
  //  Authorization: 'Basic YmFua3Zpc2lvbjpiYW5rdmlzaW9u'
    Authorization: 'Basic ' + btoa("bankvision:bankvision")
  })
};

export interface Token {
  id: number;
  activo: number;
  descripcion: string;
  compania: string;
  data: JSON
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }
  HttpUrlAuth: string = environment.HttpUrlToken + 'auth-service';
  HttpUrlAes: string =  environment.HttpUrlToken + 'aes-service';
  HttpUrlUser: string = environment.HttpUrl + 'users-suite-c';

  //HttpUrlUser: string = 'http://localhost:8080';

  getNewToken(username: string, password: string = 'bankvision', grant_type: string = 'password', exists: boolean = false) {
    var result:any = null;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', grant_type);
    this.http.post<any>(this.HttpUrlAuth + '/oauth/token', formData, httpOptions).subscribe(async x => {
      //let access_token = await this.decrypt(x);
      await this.decrypt(x, async (answ: { [x: string]: any; }[]) => {
        let access_token = answ[0]["access_token"];
        //this.decrypt(x, () => {});
        if (access_token === null) {
          //console.log('Error en la decodificación del token');
        } else {
          if (exists) {
            await this.updateToken(username, x);
          } else {
            await this.storeNewToken(username, x);
          }
        }
        result = access_token;
     
      });
    }, error => {
      //console.log('Error en la generación del Token: ' + error.error['descripcion']);
    }).add(() => {
      console.log('result', result)
      
    });
  }


  async getToken(username: string, _callback: { (result: string): void; (arg0: any): void; }, password: string = 'bankvision', grant_type: string = 'password') {
   
    var result: any = null;
    let data = {"compania":username};
    this.http.post<any>(this.HttpUrlUser + '/token/getTokenByCompany', JSON.parse(JSON.stringify(data)), httpOptions).subscribe(async x => {
      if("valid" in x){
        if (x["valid"]){
          result = x["access_token"];
        } else {
          result = await this.getNewToken(username,password,grant_type, true);
        }
      }else {
        //console.log('No se encontró token activo para esta compañía en la base de datos');
        //console.log('Se esta generando un token nuevo para la compañía ' + username);
        result = await this.getNewToken(username,password,grant_type, false);
      }
    }, async error => {
      //console.log('Error en la comunicación con la base de datos: ' + error.error['descripcion']);
    }).add(() => {
      _callback(result);
      return result;
    });
  }

  async storeNewToken(compania: string, data: JSON, descripcion: string = ''){

    let token = {
      "compania":compania,
      "active":1,
      "data":JSON.stringify(data),
      "description":descripcion
    };
    this.http.post<any>(this.HttpUrlUser + '/token/setToken', JSON.parse(JSON.stringify(token)), httpOptions).subscribe(x => {
    //this.http.post<any>(this.HttpUrlUser + '/token/setToken', token, httpOptions).subscribe(x => {
      //console.log('Se ha guardado el nuevo token en la base de datos');
    }, error => {
      //console.log('No se puede almacenar el nuevo token en la base de datos: ' + error.error['descripcion']);
    });
    //console.log('Se esta almacenando un nuevo token');
  }

  async updateToken(compania: string, data: JSON, descripcion: string = ''){
    let token = {
      "compania":compania,
      "active":1,
      "data":JSON.stringify(data),
      "description":descripcion
    };
    this.http.put<any>(this.HttpUrlUser + '/token/updateActiveTokenByCompany', JSON.parse(JSON.stringify(token)), httpOptions).subscribe(x => {
      //console.log('Se ha actualizando el token en la base de datos');
    }, error => {
      //console.log('No se puede actualizar el token en la base de datos: ' + error.error['descripcion']);
    });
    
  }

  decrypt(data: JSON, _callback:any) {
    var result:any = null;
    this.http.post<any>(this.HttpUrlAes + '/decrypt', data, httpOptions).subscribe(x => {
      result = x;
    }, error => {
      //console.log('Error en la decodificación de la información: ' + error.error['descripcion']);
    }).add(() => {
      _callback(result);
      return result;
    });
  }

  encrypt(data: JSON, _callback:any) {
    var result:any = null;
    this.http.post<any>(this.HttpUrlAes + '/encrypt', data, httpOptions).subscribe(x => {
      result = x;
      return x;
    }, error => {
      //console.log('Error en la codificación de la información: ' + error.error['descripcion']);
    }).add(() => {
      _callback();
      return result;
    });
  }

}
