import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as moment from 'moment';
import {DateService} from '../../shared/date.service';
import {Task, Week} from '../../shared/interfaces/interfaces';

moment.locale('ru');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  @Input() allTasks: Task[];
  calendar: Week[];

  constructor(
    private dateService: DateService
  ) { }
  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
  }
  generate(now: moment.Moment): void {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];
    const tasks = Array.from(new Set(Object.keys(this.allTasks)));
    console.log(tasks);
    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7).fill(0).map(() => {
          const value = date.add(1, 'day').clone();
          const active = moment().isSame(value, 'date');
          const disabled = !now.isSame(value, 'month');
          const selected = now.isSame(value, 'date');
          const hasTasks = Boolean(tasks.find(el => el === value.format('DD-MM-YYYY')));
          return {
            value, active, disabled, selected, hasTasks
          };
        })
      });
    }
    this.calendar = calendar;
  }
  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }

}
