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
  loading;
  constructor(private wechatPayQRCodeService: WechatPayQRCodeService) { }

  ngOnInit(): void {
    this.loading = true;
    this.qrCodeLinkUrl = this.wechatPayQRCodeService.qrCodeUrl;
    this.qrCodeImageUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + this.qrCodeLinkUrl + "&&size=100x100"
    this.loading = false;
  }

}
