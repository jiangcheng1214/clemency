import { TestBed } from '@angular/core/testing';

import { WechatPayQRCodeService } from './wechat-pay-qrcode.service';

describe('WechatPayQRCodeService', () => {
  let service: WechatPayQRCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WechatPayQRCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
