import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memory'
})
export class MemoryPipe implements PipeTransform {

  transform(value: number | string, exceeded?: boolean): string {
    if (isNaN(+value)) {
      return value as string;
    }
    if (exceeded) {
      return `> ${value}MB`;
    }
    return `${value}MB`;
  }

}
