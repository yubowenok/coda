import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(t: number, args?: any): any {
    return moment(t).format('MMM Do YYYY, h:mm:ss a');
  }

}
