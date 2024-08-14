import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Weather } from '../interfaces/weather';
import type { Reminder } from '../interfaces/reminder';
import { ModalComponent } from '../modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-calendar-modal',
  styleUrl: './calendarmodal.component.scss',
  templateUrl: './calendarmodal.component.html',
  imports: [CommonModule, FormsModule, ModalComponent],
})
export class CalendarModalComponent {
  @Input() weather?: Weather;
  @Input() selectedDay?: string;
  @Input() reminderTime?: string;
  @Input() showWeather?: boolean;
  @Input() selectedWeek?: string;
  @Input() selectedYear?: string;
  @Input() reminderTitle?: string;
  @Input() reminderColor?: string;
  @Input() selectedMonth?: string;
  @Input() reminderCityName?: string;
  @Input() reminderDescription?: string;
  @Input() calendarModalKey?: string = '';

  @Output() clearForm = new EventEmitter<void>();
  @Output() handleSave = new EventEmitter<string>();
  @Output() handleGetCity = new EventEmitter<string>();

  
  public colors: string[] = [
    "rgb(255, 87, 51)",
    "rgb(51, 255, 87)",
    "rgb(51, 122, 255)",
    "rgb(255, 51, 249)",
    "rgb(255, 215, 0)",
  ];
  public selectedColor: string = this.colors[0];

  ngOnInit(): void {
    this.reminderColor = this.selectedColor;
  }

  public isColorSelected(color: string): boolean {
    return this.selectedColor === color;
  }

  public clear() {
    this.clearForm.emit();
    this.reminderTime = '';
    this.reminderColor = '';
    this.reminderTitle = '';
    this.reminderCityName = '';
    this.reminderDescription = '';
  }

  public getCity() {
    this.handleGetCity.emit(this.reminderCityName);
  }

  public saveColor(color: string) {
    this.reminderColor = color;
    this.selectedColor = color;
  }

  public save() {
    this.handleSave.emit(
      JSON.stringify({
        time: this.reminderTime,
        color: this.reminderColor,
        title: this.reminderTitle,
        weather: this.weather as Weather,
        description: this.reminderDescription,
      } as Reminder)
    );
    this.clear();
  }
}
