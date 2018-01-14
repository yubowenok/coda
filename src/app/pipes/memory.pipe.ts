import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memory'
})
export class MemoryPipe implements PipeTransform {

  transform(value: number, exceeded?: boolean): string {
    if (exceeded) {
      return `> ${value}MB`;
    }
    return `${value}MB`;
  }

}
