
import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  environment:any = environment
  tokenKey:any = this.environment['tokenKey']? this.environment["tokenKey"] : '1524';
  refreshKey = this.environment['refreshKey'] ? this.environment["refreshKey"] : '9163';
  constructor() { }
  //Métodos para manejar almacenamiento

 /*  public setsessionStorage(key: string, data) {
    this.setStorage(0, key, data);
  } */

  /* public readsessionStorage(key: string) {
    return this.readStorage(0, key);
  }
 */

 /*  public setSesionStorage(key: string, data) {
    this.setStorage(1, key, data);
  }
 */
 /*  public readSesionStorage(key: string) {
    return this.readStorage(1, key);
  }

 */
 /*  public setCookie(key: string, data, expires = 0) {
    this.setStorage(2, key, data, expires);
  } */

 /*  public readCookie(key: string) {
    return this.readStorage(2, key);
  } */


  private storageKey(key: string) {
    return key === "" ? this.tokenKey : key;
  }

  /* private setStorage(location: number, key: string, value, expires = 0) {
    let data = JSON.stringify(value);
    let encryptedData:any = crypto.AES.encrypt(data.toString(), "9e7j0c7n2o1k0e3y6j0a6");
    key = this.storageKey(key);
    switch (location) {
      case 0:
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, encryptedData);
        break;
      case 1:
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, encryptedData);
        break;
      case 2:
        if (key == this.tokenKey) {
          let date = new Date();
          let time = date.getTime();
          time += (value['token']['expires_in']*1000);
          date.setTime(time);
          this._cookieService.set(this.refreshKey, '', date, '/');
        }
        this._cookieService.delete(key, '/');
        this._cookieService.set(key, encryptedData, expires, '/');
        break;
      default:
        break;
    }

  } */

/*   private readStorage(location: number, key: string) {
    key = this.storageKey(key);
    let encryptedData;
    switch (location) {
      case 0:
        encryptedData = sessionStorage.getItem(key);
        break;
      case 1:
        encryptedData = sessionStorage.getItem(key);
        break;
      case 2:
        encryptedData = this._cookieService.get(key);
        break;
      default:
        break;
    }
    if (encryptedData) {
      let decryptedData = crypto.AES.decrypt(encryptedData, "9e7j0c7n2o1k0e3y6j0a6");
      return JSON.parse(decryptedData.toString(crypto.enc.Utf8));
    }
    return null;
  }
 */

   protected encrypt(value:any) {
     // const data = this.readCookie(this.storageKey("90325F38F29BA5B60C2AA637DB78281C"));
    //var key = crypto.enc.Utf8.parse('90325F38F29BA5B60C2AA637DB78281C');
     var key = crypto.enc.Hex.parse('90325F38F29BA5B60C2AA637DB78281C');
    var iv = crypto.enc.Hex.parse('0000000000000000');
    var encrypted = crypto.AES.encrypt(crypto.enc.Utf8.parse(value.toString()), key,
    {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.ZeroPadding
    });
    const DATA = { data: encrypted.toString() };
    return DATA;
  }
  

   protected decrypt(value:any) {
    // ////console.log(value)
    var key = crypto.enc.Hex.parse('90325F38F29BA5B60C2AA637DB78281C');
    var iv = crypto.enc.Hex.parse('0000000000000000');
    var decrypted = crypto.AES.decrypt(value, key, {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.ZeroPadding
    });
    
    // ////console.log(decrypted.toString(crypto.enc.Latin1))
    return decrypted.toString(crypto.enc.Latin1)
    // return decrypted.toString(crypto.enc.Utf8);
  }
}
