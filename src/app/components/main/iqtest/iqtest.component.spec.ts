import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IQTestComponent } from './iqtest.component';

describe('IQTestComponent', () => {
  let component: IQTestComponent;
  let fixture: ComponentFixture<IQTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IQTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IQTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
