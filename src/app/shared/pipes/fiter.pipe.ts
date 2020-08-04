import { Pipe, PipeTransform } from '@angular/core';
import {Task} from '../interfaces/interfaces';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe  implements PipeTransform {
  transform(array: Task[], field: string, value: any): any {
    if (array.length > 0) {
      return array.filter(el => el[field] === value).length;
    }
    else {
      return 0;
    }
  }
}
