import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WechatPayQRCodeComponent } from './wechat-pay-qrcode.component';

describe('WechatPayQRCodeComponent', () => {
  let component: WechatPayQRCodeComponent;
  let fixture: ComponentFixture<WechatPayQRCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WechatPayQRCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WechatPayQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
