import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'executionTime'
})
export class ExecutionTimePipe implements PipeTransform {

  transform(value: number, exceeded?: boolean): string {
    if (exceeded) {
      return `> ${value}s`;
    }
    return `${value}s`;
  }

}
