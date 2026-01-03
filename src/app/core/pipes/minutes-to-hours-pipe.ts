import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours',
  standalone: true,
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '0h';
    }

    const totalMinutes = Number(value);

    if (isNaN(totalMinutes) || totalMinutes < 0) {
      return '0h';
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours && minutes) {
      return `${hours}h ${minutes}m`;
    }

    if (hours) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  }
}
