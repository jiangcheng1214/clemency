import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishDescriptionsComponent } from './english-descriptions.component';

describe('EnglishDescriptionsComponent', () => {
  let component: EnglishDescriptionsComponent;
  let fixture: ComponentFixture<EnglishDescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishDescriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
