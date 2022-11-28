import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';


import { ConverterService } from '../services/converter.service';
import { ServicesService } from '../services/services.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page extends ConverterService  {
 
img:any=''
img2:any=''
imgEnviar:any
blob:any =''
blob2:any =''
cedulaFrontal:any
fotoRostro:any
  constructor(private services:ServicesService, private alertController: AlertController,private loadingCtrl: LoadingController,) {
    super()
  }
   takePicture = async () => {
    this.img = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
      
    });

    const rawData = atob(this.img.base64String);
    const bytes = new Array(rawData.length);
    for (var x = 0; x < rawData.length; x++) {
        bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], {type: 'image/png'});
      this.blob = URL.createObjectURL(blob);
      var png = this.img.base64String;

      var the_file: any = this.dataURItoBlob(png);
      this.cedulaFrontal = new File([the_file], 'cc.png', { type: 'image/png' });
      console.log(this.cedulaFrontal)
  };

  takePicture1 = async () => {
    this.img2 = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    const rawData = atob(this.img2.base64String);
    const bytes = new Array(rawData.length);
    for (var x = 0; x < rawData.length; x++) {
        bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], {type: 'image/png'});
      this.blob2 = URL.createObjectURL(blob);
      var png = this.img2.base64String;

      var the_file: any = this.dataURItoBlob(png);
      this.fotoRostro = new File([the_file], 'cc.png', { type: 'image/png' });
      console.log(this.fotoRostro)
      
  };
  comparar(){
    this.showLoading('un momento por favor')
    let fd = new FormData
    fd.append("file1", this.fotoRostro)
    fd.append('file2', this.cedulaFrontal)
    // console.log('comparacion rostro', fd)
    
      this.services.faceComparison(fd).subscribe({
        next:(x:any)=>{
          console.log(x)
          let response:any = this.decrypt(x['data'])
          let face = response.split('}')
          let y = `${face[0]}}`
          let final :any = JSON.parse(y)
          // console.log("ya casito",final)
          console.log(final)
          if (final.same_person==true){
            this.loadingCtrl.dismiss()
          this.presentAlert('valido')
          }else{
            this.loadingCtrl.dismiss()
            this.presentAlert('no valido ')

          }
        },
        error:(error:any)=>{
          this.loadingCtrl.dismiss()
          this.presentAlert('Error al comparar rostros')
        }
      })
  }
  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8ClampedArray(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  async presentAlert(mensaje:string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      // subHeader: 'Important message',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async showLoading(message:string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      // duration: 3000
    });
    
    loading.present();
  }

}
