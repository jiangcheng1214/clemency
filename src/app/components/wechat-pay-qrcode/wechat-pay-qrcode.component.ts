import { Component, OnInit } from '@angular/core';
import { WechatPayQRCodeService } from 'src/app/services/wechat-pay-qrcode.service';

@Component({
  selector: 'app-wechat-pay-qrcode',
  templateUrl: './wechat-pay-qrcode.component.html',
  styleUrls: ['./wechat-pay-qrcode.component.css']
})
export class WechatPayQRCodeComponent implements OnInit {
  qrCodeLinkUrl;
  qrCodeImageUrl;
  constructor(private wechatPayQRCodeService: WechatPayQRCodeService) { }

  ngOnInit(): void {
    this.qrCodeLinkUrl = this.wechatPayQRCodeService.qrCodeUrl;
    console.log(this.qrCodeLinkUrl)
    this.qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + this.qrCodeLinkUrl + "&&size=100x100"
    console.log(this.qrCodeImageUrl)
  }

}
