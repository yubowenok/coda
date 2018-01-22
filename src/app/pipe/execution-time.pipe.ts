import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'executionTime'
})
export class ExecutionTimePipe implements PipeTransform {

  transform(value: number | string, exceeded?: boolean): string {
    if (isNaN(+value)) {
      return value as string;
    }
    if (exceeded) {
      return `> ${value}s`;
    }
    return `${value}s`;
  }

}
