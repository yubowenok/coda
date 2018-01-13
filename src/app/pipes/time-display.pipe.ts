import { Pipe, PipeTransform } from '@angular/core';
import * as time from '../constants/time';

@Pipe({
  name: 'timeDisplay'
})
export class TimeDisplayPipe implements PipeTransform {

  transform(t: number, args?: any): string {
    t *= time.SECOND_MS;
    const hours = Math.floor(t / time.HOUR_MS);
    let minutes: number | string = Math.floor(t % time.HOUR_MS / time.MINUTE_MS);
    let seconds: number | string = t % time.MINUTE_MS / time.SECOND_MS;
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

}
