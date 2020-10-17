import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicMobilityComponent } from './economic-mobility.component';

describe('EconomicMobilityComponent', () => {
  let component: EconomicMobilityComponent;
  let fixture: ComponentFixture<EconomicMobilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomicMobilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicMobilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
