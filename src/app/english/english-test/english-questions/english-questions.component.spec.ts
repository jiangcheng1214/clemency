import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishQuestionsComponent } from './english-questions.component';

describe('EnglishQuestionsComponent', () => {
  let component: EnglishQuestionsComponent;
  let fixture: ComponentFixture<EnglishQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
