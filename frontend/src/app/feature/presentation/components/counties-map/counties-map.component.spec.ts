import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountiesMapComponent } from './counties-map.component';

describe('CountiesMapComponent', () => {
  let component: CountiesMapComponent;
  let fixture: ComponentFixture<CountiesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountiesMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountiesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
