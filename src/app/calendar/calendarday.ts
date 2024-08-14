import { Reminder } from '../interfaces/reminder';

export class CalendarDay {
  public date?: Date;
  public isToday?: boolean;
  public isPastDate?: boolean;
  public reminders: Reminder[] = [];

  public addDate(date: Date) {
    this.date = date;
    this.isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
    this.isPastDate =
      date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  }

  public getDateString(): string {
    return String(this.date?.toISOString().split('T')[0]);
  }

  public addReminder(reminder: Reminder): void {
    const existingReminderIndex = this.reminders.findIndex(
      (r) => r.id === reminder.id
    );
    if (existingReminderIndex === -1) {
      this.reminders.push(reminder);
    } else {
      this.reminders[existingReminderIndex] = reminder;
    }
  }
}
