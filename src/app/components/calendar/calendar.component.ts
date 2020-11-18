import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import { DateService } from '../../shared/services/date.service';
import { TasksService } from '../../shared/services/tasks.service';
import { Week } from '../../shared/interfaces/interfaces';
import { ClockService } from '../../shared/services/clock.sevice';

moment.locale('ru');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  calendar: Week[];
  tasks = [];
  collapsed = false;
  constructor(
    public dateService: DateService,
    public tasksService: TasksService,
    public clockService: ClockService
  ) { }
  ngOnInit(): void {
    this.dateService.date$.subscribe(this.generate.bind(this));
    this.tasksService.tasks$.subscribe(value => {
      if (value) {
        this.tasks = value;
        this.generate(this.dateService.date$.value);
      }
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
          const dayTasks = this.tasks.filter(task => task.date === value.format('DD-MM-YYYY')).length;
          return {
            value, active, disabled, selected, dayTasks
          };
        })
      });
    }
    this.calendar = calendar;
  }
  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
  goMonth(dir: number): void {
    this.dateService.changeMonth(dir);
  }
  collapse(): void {
    this.collapsed = !this.collapsed;
  }
}
