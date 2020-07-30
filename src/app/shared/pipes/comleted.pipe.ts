import { Pipe, PipeTransform } from '@angular/core';
import {Task} from '../interfaces/interfaces';

@Pipe({
  name: 'comleted',
  pure: false
})

export class CompletedPipe  implements PipeTransform {
  transform(array: Task[]): any {
    if (array.length > 0) {
      return array.filter(el => el.isDone === true).length;
    }
    else {
      return 0;
    }
  }
}
