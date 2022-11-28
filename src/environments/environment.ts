// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //httpUrl : "https://dev.bankvision.com/v1/"
  //httpUrl: "https://cloud.bankvision.com/"
  HttpUrl: [
    /* 'https://pruebas.bankvision.com/web-login-service/web/', */
    /* 'http://localhost:8080/', */
      'https://pruebas.bankvision.com/'  
    //  'https://certificacion.bankvision.com/' 
  ],
 
  // HttpUrlToken: 'https://certificacion.bankvision.com/', 
   HttpUrlToken: 'https://pruebas.bankvision.com/',
  // images:'../assets',
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
