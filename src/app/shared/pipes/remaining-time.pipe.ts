import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingTime'
})
export class RemainingTimePipe implements PipeTransform {

  transform(endDate: number, ...args: unknown[]): unknown {
    return this.calculateTimeDifference(endDate);
  }

  calculateTimeDifference(endDate): string {
    const secDiff = Math.floor((endDate - new Date().getTime()) / 1000);
    if (secDiff < 0) {
      return '--';
    }
    const minDiff = Math.floor(secDiff / 60);
    const hoursDiff = Math.floor(minDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    if (daysDiff >= 1) {
      return `${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
    }
    if (hoursDiff >= 1) {
      return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''}`;
    }
    if (minDiff >= 0) {
      return `${minDiff} minute${minDiff > 1 ? 's' : ''}`;
    }
    return `${secDiff} second${secDiff > 1 ? 's' : ''}`;
  }

}
