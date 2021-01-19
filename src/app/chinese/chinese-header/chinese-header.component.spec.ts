import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChineseHeaderComponent } from './chinese-header.component';

describe('ChineseHeaderComponent', () => {
  let component: ChineseHeaderComponent;
  let fixture: ComponentFixture<ChineseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChineseHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChineseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
