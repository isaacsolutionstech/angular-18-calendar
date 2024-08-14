import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ChunkPipe } from './chuckpipe';
import { CalendarDay } from './calendarday';

import { ApiService } from '../api/api.service';
import type { Weather } from '../interfaces/weather';
import { ModalService } from '../modal/modal.service';
import { CalendarModalComponent } from '../calendarmodal/calendarmodal.component';
import type { Reminder } from '../interfaces/reminder';

@Component({
  standalone: true,
  selector: 'app-calendar',
  styleUrl: './calendar.component.scss',
  templateUrl: './calendar.component.html',
  imports: [CommonModule, ChunkPipe, CalendarModalComponent],
})
export class CalendarComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  public monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public weekNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  public displayYear?: string;
  public displayMonth?: string;
  public selectedDay?: string;
  public selectedWeek?: string;
  public selectedYear?: string;
  public selectedMonth?: string;

  public reminderTime: string = '';
  public reminderColor: string = '';
  public reminderTitle: string = '';
  public reminderCityName: string = '';
  public reminderDescription: string = '';

  public showWeather?: boolean;
  public weather: Weather = {} as Weather;

  private selectedDate?: Date;
  private monthIndex: number = 0;
  private remindersMap: Map<string, Reminder[]> = new Map();

  constructor(
    private modalService: ModalService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex);
  }

  private generateCalendarDays(monthIndex: number): void {
    const newCalendar: CalendarDay[] = [];
    const day: Date = new Date(
      new Date().setMonth(new Date().getMonth() + monthIndex)
    );
    this.displayYear = String(day.getFullYear());
    this.displayMonth = this.monthNames[day.getMonth()];
    let dateToAdd = this.getStartDateForCalendar(day);

    for (let i = 0; i < 42; i++) {
      const calendarday = new CalendarDay();
      calendarday.addDate(new Date(dateToAdd));

      // Retrieve any existing reminders for the date
      const dateString = calendarday.getDateString();
      calendarday.reminders = this.remindersMap.get(dateString) || [];

      newCalendar.push(calendarday);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    this.calendar = newCalendar;
  }

  private getStartDateForCalendar(selectedDate: Date) {
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(
          startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1)
        );
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

  public clearForm() {
    this.reminderTime = '';
    this.reminderColor = '';
    this.reminderTitle = '';
    this.showWeather = false;
    this.reminderCityName = '';
    this.weather = {} as Weather;
    this.reminderDescription = '';
  }

  public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--;
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }

  public openModal(date: Date): void {
    this.selectedDate = date;
    this.selectedDay = String(date.getDate());
    this.selectedYear = String(date.getUTCFullYear());
    this.selectedWeek = this.weekNames[date.getDay() - 1];
    this.selectedMonth = this.monthNames[date.getMonth()];
    this.modalService.open(String(date));
  }

  public handleGetCity(cityName: string) {
    if (cityName.length) {
      this.apiService.getCityData(cityName.trim()).subscribe({
        next: (data) => {
          this.weather = data;
          this.showWeather = true;
        },
        error: (error) => {
          this.showWeather = false;
          console.error('Error getting city data: ', error);
        },
      });
      return;
    }

    this.showWeather = false;
  }

  public handleSave(formData: string) {
    const form = {
      ...JSON.parse(formData),
      id: Date.now().toString(),
    } as Reminder;

    if (this.selectedDate) {
      const day = this.calendar.find(
        (day) => day.date?.toDateString() === this.selectedDate?.toDateString()
      );
      if (day) {
        const dateString = day.getDateString();
        const currentReminders = this.remindersMap.get(dateString) || [];
        const existingReminderIndex = currentReminders.findIndex(
          (reminder) => reminder.id === form.id
        );

        if (existingReminderIndex === -1) {
          currentReminders.push(form);
          this.remindersMap.set(dateString, currentReminders);
          day.addReminder(form);
        } else {
          currentReminders[existingReminderIndex] = form;
          this.remindersMap.set(dateString, currentReminders);
          day.reminders[existingReminderIndex] = form;
        }

        this.modalService.close(String(day.date));
      }
      this.clearForm();
    }
  }
}
