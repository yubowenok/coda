import { Pipe, PipeTransform } from '@angular/core';
import { VerdictDisplay } from '../constants/submission';

@Pipe({
  name: 'verdictDisplay'
})
export class VerdictDisplayPipe implements PipeTransform {

  transform(verdict: string, args?: any): string {
    if (!(verdict in VerdictDisplay)) {
      console.warn(`${verdict} not in VerdictDisplay`);
      return '';
    }
    return VerdictDisplay[verdict];
  }

}
