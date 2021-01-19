import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishFooterComponent } from './english-footer.component';

describe('EnglishFooterComponent', () => {
  let component: EnglishFooterComponent;
  let fixture: ComponentFixture<EnglishFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
