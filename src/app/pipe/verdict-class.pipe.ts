import { Pipe, PipeTransform } from '@angular/core';
import { Verdict } from '../constants/submission';

@Pipe({
  name: 'verdictClass'
})
export class VerdictClassPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value === Verdict.AC) {
      return 'correct bold';
    } else if (value === Verdict.SKIPPED || value === Verdict.PENDING) {
      return '';
    } else {
      return 'incorrect bold';
    }
  }

}
