import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DateService {
  public date$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  changeDay(dir: number): void {
    const value = this.date$.value.add(dir, 'days');
    this.date$.next(value);
  }
  changeMonth(dir: number): void {
    const value = this.date$.value.add(dir, 'months');
    this.date$.next(value);
  }
  changeDate(date: moment.Moment): void {
    const value = this.date$.value.set({
      date: date.date(),
      month: date.month()
    });
    this.date$.next(value);
  }
  goToday(): void {
    this.date$.next(moment());
  }
}
