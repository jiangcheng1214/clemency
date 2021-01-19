import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishHeaderComponent } from './english-header.component';

describe('EnglishHeaderComponent', () => {
  let component: EnglishHeaderComponent;
  let fixture: ComponentFixture<EnglishHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
