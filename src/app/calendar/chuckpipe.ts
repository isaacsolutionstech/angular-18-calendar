import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk',
  standalone: true,
})
export class ChunkPipe implements PipeTransform {
  transform(calendarDaysArray: any, chunkSize: number): any {
    let weekDays: string[] = [];
    let calendarDays: string[] = [];

    calendarDaysArray.map((day: string, index: number) => {
      weekDays.push(day);
      if (++index % chunkSize === 0) {
        calendarDays.push(weekDays as never);
        weekDays = [];
      }
    });
    return calendarDays;
  }
}