import { Pipe, PipeTransform } from '@angular/core';
import { errors } from '../errors/errors';

@Pipe({
  name: 'error',
  pure: false
})

export class ErrorPipe implements PipeTransform {
  transform(error: string): string {
    const result = errors.find(el => el.eng === error);
    return result ? result.rus : error;
  }
}
