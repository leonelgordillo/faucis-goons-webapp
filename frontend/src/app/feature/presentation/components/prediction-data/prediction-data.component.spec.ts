import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionDataComponent } from './prediction-data.component';

describe('PredictionDataComponent', () => {
  let component: PredictionDataComponent;
  let fixture: ComponentFixture<PredictionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
