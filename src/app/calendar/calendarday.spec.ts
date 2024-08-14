import { CalendarDay } from './calendarday';
import { Reminder } from '../interfaces/reminder';

describe('CalendarDay', () => {
  let calendarDay: CalendarDay;

  beforeEach(() => {
    calendarDay = new CalendarDay();
  });

  it('should initialize with default values', () => {
    expect(calendarDay.date).toBeUndefined();
    expect(calendarDay.isToday).toBeUndefined();
    expect(calendarDay.isPastDate).toBeUndefined();
    expect(calendarDay.reminders).toEqual([]);
  });

  describe('addDate', () => {
    it('should set the date and check if it is today or past', () => {
      const date = new Date();
      calendarDay.addDate(date);

      // Check if the date is set
      expect(calendarDay.date).toEqual(date);

      // Check if the date is today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(calendarDay.isToday).toBe(date.setHours(0, 0, 0, 0) === today.getTime());

      // Check if the date is past
      expect(calendarDay.isPastDate).toBe(date.getTime() < today.getTime());
    });
  });

  describe('getDateString', () => {
    it('should return the date as a string in YYYY-MM-DD format', () => {
      const date = new Date('2024-08-14T00:00:00Z'); // Use ISO format with timezone
      calendarDay.addDate(date);

      expect(calendarDay.getDateString()).toBe('2024-08-13');
    });
  });

  describe('addReminder', () => {
    it('should add a new reminder to the list', () => {
      const reminder: Reminder = {
        id: '1',
        title: 'Test Reminder',
        color: 'rgb(51, 122, 255)',
        description: 'Desc Test Reminder',
        time: '10:30 AM',
        weather: {
          name: 'China',
          main: {
            temp: 20,
            humidity: 80,
          },
          wind: {
            speed: 20,
          },
        },
      };

      calendarDay.addReminder(reminder);

      expect(calendarDay.reminders).toContain(reminder);
    });

    it('should update an existing reminder', () => {
      const reminder: Reminder = {
        id: '1',
        title: 'Test Reminder',
        color: 'rgb(51, 122, 255)',
        description: 'Desc Test Reminder',
        time: '08:30 AM',
        weather: {
          name: 'Jão Pessoa',
          main: {
            temp: 30,
            humidity: 40,
          },
          wind: {
            speed: 28,
          },
        },
      };
      calendarDay.addReminder(reminder);

      const updatedReminder: Reminder = {
        id: '1',
        title: 'Updated Reminder',
        color: 'rgb(51, 122, 255)',
        description: 'Desc Updated Reminder',
        time: '08:30 AM',
        weather: {
          name: 'São Paulo',
          main: {
            temp: 30,
            humidity: 40,
          },
          wind: {
            speed: 28,
          },
        },
      };
      calendarDay.addReminder(updatedReminder);

      expect(calendarDay.reminders.find((r) => r.id === '1')?.title).toBe('Updated Reminder');
    });
  });
});