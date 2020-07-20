import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  changeMonth(dir: number): void {
    const value = this.date.value.add(dir, 'months');
    this.date.next(value);
  }
}
