import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
  pure: false
})
export class MomentPipe implements PipeTransform {
  transform(m: moment.Moment, format: string = 'YYYY MMMM'): string {
    if (typeof m === 'string') {
      return moment(m).format(format);
    }
    return m.format(format);
  }
}
