import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishTestComponent } from './english-test.component';

describe('EnglishTestComponent', () => {
  let component: EnglishTestComponent;
  let fixture: ComponentFixture<EnglishTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
