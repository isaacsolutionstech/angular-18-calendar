import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarModalComponent } from './calendarmodal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { By } from '@angular/platform-browser';

describe('CalendarModalComponent', () => {
  let component: CalendarModalComponent;
  let fixture: ComponentFixture<CalendarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ModalComponent, CalendarModalComponent],
      // Remove CalendarModalComponent from declarations
      declarations: [],  // No components here
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.reminderColor).toBe(component.colors[0]);
    expect(component.selectedColor).toBe(component.colors[0]);
  });

  describe('clear', () => {
    it('should emit clearForm event and reset form fields', () => {
      spyOn(component.clearForm, 'emit');

      component.clear();

      expect(component.clearForm.emit).toHaveBeenCalled();
      expect(component.reminderTime).toBe('');
      expect(component.reminderTitle).toBe('');
      expect(component.reminderCityName).toBe('');
      expect(component.reminderDescription).toBe('');
      expect(component.reminderColor).toBe(component.colors[0]);
      expect(component.selectedColor).toBe(component.colors[0]);
    });
  });

  describe('getCity', () => {
    it('should emit handleGetCity event with reminderCityName', () => {
      component.reminderCityName = 'Test City';
      spyOn(component.handleGetCity, 'emit');

      component.getCity();

      expect(component.handleGetCity.emit).toHaveBeenCalledWith('Test City');
    });
  });

  describe('saveColor', () => {
    it('should update reminderColor and selectedColor', () => {
      const newColor = 'rgb(51, 122, 255)';
      component.saveColor(newColor);

      expect(component.reminderColor).toBe(newColor);
      expect(component.selectedColor).toBe(newColor);
    });
  });

  describe('save', () => {
    it('should emit handleSave event with reminder data and call clear', () => {
      spyOn(component.handleSave, 'emit');
      spyOn(component, 'clear');

      component.reminderTime = '10:00';
      component.reminderColor = 'rgb(255, 87, 51)';
      component.reminderTitle = 'Test Reminder';
      component.reminderDescription = 'Test Description';
      component.weather = {
        name: 'Rio de Janeiro',
        main: {
          temp: 16,
          humidity: 40,
        },
        wind: {
          speed: 40,
        }
      };

      component.save();

      const expectedReminder = JSON.stringify({
        time: component.reminderTime,
        color: component.reminderColor,
        title: component.reminderTitle,
        weather: component.weather,
        description: component.reminderDescription,
      });

      expect(component.handleSave.emit).toHaveBeenCalledWith(expectedReminder);
      expect(component.clear).toHaveBeenCalled();
    });
  });

  describe('isColorSelected', () => {
    it('should return true if the color is selected', () => {
      component.selectedColor = 'rgb(255, 87, 51)';
      expect(component.isColorSelected('rgb(255, 87, 51)')).toBeTrue();
      expect(component.isColorSelected('rgb(51, 255, 87)')).toBeFalse();
    });
  });
});