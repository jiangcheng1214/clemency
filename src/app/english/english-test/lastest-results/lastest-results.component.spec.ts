import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastestResultsComponent } from './lastest-results.component';

describe('LastestResultsComponent', () => {
  let component: LastestResultsComponent;
  let fixture: ComponentFixture<LastestResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastestResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
