import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { ConverterService } from '../services/converter.service';
import { ServicesService } from '../services/services.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page extends ConverterService{
  img:any=''
  blob:any =''
  cedulaTrasera:any
  constructor(private services:ServicesService, private alertController: AlertController,  private loadingCtrl: LoadingController,) {
    super()
  }
  takePicture = async () => {
    this.img = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      
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
      this.cedulaTrasera = new File([the_file], 'cc.png', { type: 'image/png' });
      console.log(this.cedulaTrasera)
  };
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

  readInfo(){
    this.showLoading('un momento por favor')
    let fd = new FormData()
    fd.append("file", this.cedulaTrasera)
    
     this.services.documentReading(fd).subscribe({
      next:(x:any)=>{
        console.log(x)
        // alert(x.error)
        let response = this.decrypt(x['data'])
        
         let cc = response.split('}')
         
        let y = `${cc[0]}}`
       
        let final :any = JSON.parse(y) 
        this.loadingCtrl.dismiss()
        this.presentAlert(JSON.stringify(final))
      },
      error: (error:any)=>{
        this.loadingCtrl.dismiss()
        this.presentAlert('Error al leer la info')
      }
    }) 
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
