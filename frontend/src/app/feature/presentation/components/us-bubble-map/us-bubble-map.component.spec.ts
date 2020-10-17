import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsBubbleMapComponent } from './us-bubble-map.component';

describe('UsBubbleMapComponent', () => {
  let component: UsBubbleMapComponent;
  let fixture: ComponentFixture<UsBubbleMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsBubbleMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsBubbleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
