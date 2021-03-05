import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WechatPayQRCodeService {
  qrCodeUrl;

  constructor() { }

  setQRUrl(url: string) {
    this.qrCodeUrl = url;
  }
}
