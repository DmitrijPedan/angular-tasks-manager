import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class ClockSevice {
  time$: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  start(): void {
    setInterval(() => {
      this.time$.next(moment());
    }, 1000);
  }
}
