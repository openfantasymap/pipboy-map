import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nicedate'
})
export class NicedatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace('AD', 'CE').replace('BC', 'BCE');
  }

}
