import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { DateService } from '../../shared/services/date.service';
import { TasksService } from '../../shared/services/tasks.service';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { Task } from '../../shared/interfaces/interfaces';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit {
  allTasks: any = [];
  dayTasks: Task[] = [];
  selectedTasks: Task[] = [];
  user = null;
  public form: FormGroup;
  public disabled = false;
  constructor(
    public dateService: DateService,
    public tasksService: TasksService,
    public authService: AuthService,
    public loaderService: LoaderService
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
    this.dateService.date$.subscribe(selectedDate => {
      this.dayTasks = this.tasksService.getDayTasks(selectedDate, this.allTasks);
      this.selectedTasks = [];
    });
    this.tasksService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.dayTasks = this.tasksService.getDayTasks(this.dateService.date$.value, tasks);
    });
    this.authService.currentUser.subscribe(user => this.user = user);
  }
  add(): void {
    this.disabled = true;
    this.loaderService.loading$.next(true);
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date$.value.format('DD-MM-YYYY'),
      isDone: false,
      selected: false,
      updated: moment(),
    };
    this.tasksService.create(task, this.user).subscribe(value => {
      this.disabled = false;
      const addedTask = {...task, id: value.id};
      this.tasksService.tasks$.next([...this.allTasks, addedTask]);
      this.form.reset();
      this.loaderService.loading$.next(false);
    }, error => {
      this.disabled = false;
      console.error('organizer!!! submit(): ', error);
      this.loaderService.loading$.next(false);
    });
  }
  done(task: Task): void {
    this.disabled = true;
    this.tasksService.done({...task, isDone: !task.isDone}, this.user).subscribe(() => {
      const filtered = this.dayTasks.map(el => el.id === task.id ? {...el, isDone: !el.isDone} : el);
      this.tasksService.tasks$.next({...this.allTasks, [this.dateService.date$.value.format('DD-MM-YYYY')]: filtered});
      this.disabled = false;
    }, error => {
      console.error('organizer!!! done(): ', error);
      this.disabled = false;
    });
  }
  remove(): void {
    this.disabled = true;
    this.loaderService.loading$.next(true);
    forkJoin(
      this.selectedTasks.map(el => this.tasksService.remove(el, this.user))
    ).subscribe(result => {
      const filtered = this.allTasks.filter(el => !this.selectedTasks.includes(el));
      this.tasksService.tasks$.next(filtered);
      this.selectedTasks = [];
      this.disabled = false;
      this.loaderService.loading$.next(false);

    }, error => {
      this.disabled = false;
      console.log('fork join err: ', error);
      this.loaderService.loading$.next(false);

    });
  }
  goToDate(event): void {
    const date = (moment(new Date(event.target.value)));
    this.dateService.date$.next(date);
  }
  goToday(): void {
    this.dateService.date$.next(moment());
  }
  selectTask(task: Task): void {
    if (this.selectedTasks.includes(task)) {
      this.selectedTasks = this.selectedTasks.filter(el => el !== task);
    } else {
      this.selectedTasks.push(task);
    }
  }
  selectAll(): void {
    if (this.selectedTasks.length === this.dayTasks.length) {
      this.selectedTasks = [];
    } else {
      this.selectedTasks = [];
      this.selectedTasks = [...this.dayTasks];
    }
  }
}
