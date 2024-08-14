import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarModalComponent } from './calendarmodal.component';

describe('CalendarmodalComponent', () => {
  let component: CalendarModalComponent;
  let fixture: ComponentFixture<CalendarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
