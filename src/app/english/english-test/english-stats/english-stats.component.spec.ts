import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishStatsComponent } from './english-stats.component';

describe('EnglishStatsComponent', () => {
  let component: EnglishStatsComponent;
  let fixture: ComponentFixture<EnglishStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
