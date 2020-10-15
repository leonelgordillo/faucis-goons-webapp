import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionGraphComponent } from './prediction-graph.component';

describe('PredictionGraphComponent', () => {
  let component: PredictionGraphComponent;
  let fixture: ComponentFixture<PredictionGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
