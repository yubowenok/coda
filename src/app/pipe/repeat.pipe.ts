import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repeat'
})
export class RepeatPipe implements PipeTransform {

  transform(count: number): number[] {
    if (count <= 0) {
      return [];
    }
    const res: number[] = [];
    for (let i = 0; i < count; i++) {
      res.push(i + 1);
    }
    return res;
  }

}
