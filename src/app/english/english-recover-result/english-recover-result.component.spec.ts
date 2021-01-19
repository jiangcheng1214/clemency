import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishRecoverResultComponent } from './english-recover-result.component';

describe('EnglishRecoverResultComponent', () => {
  let component: EnglishRecoverResultComponent;
  let fixture: ComponentFixture<EnglishRecoverResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishRecoverResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishRecoverResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
