import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { DateService } from '../../shared/services/date.service';
import { TasksService } from '../../shared/services/tasks.service';
import { Week } from '../../shared/interfaces/interfaces';

moment.locale('ru');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  calendar: Week[];
  tasks = [];
  dates = [];
  constructor(
    private dateService: DateService,
    public tasksService: TasksService
  ) { }
  ngOnInit(): void {
    this.dateService.date$.subscribe(this.generate.bind(this));
    this.tasksService.tasks$.subscribe(value => {
      this.tasks = value;
      this.dates = Object.keys(value).map(el => ({date: el, tasks: Object.values(value[el]).length}));
      this.generate(this.dateService.date$.value);
    });
  }
  generate(now: moment.Moment): void {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];
    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7).fill(0).map(() => {
          const value = date.add(1, 'day').clone();
          const active = moment().isSame(value, 'date');
          const disabled = !now.isSame(value, 'month');
          const selected = now.isSame(value, 'date');
          const currentDate = this.dates.find(el => el.date === value.format('DD-MM-YYYY'));
          const hasTasks = currentDate ? currentDate.tasks : 0;
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
