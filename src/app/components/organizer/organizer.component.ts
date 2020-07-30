import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateService } from '../../shared/services/date.service';
import { TasksService } from '../../shared/services/tasks.service';
import { AuthService } from '../../shared/services/auth.service';
import { Task } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit {
  allTasks: any = {};
  dayTasks: Task[] = [];
  user = null;
  public form: FormGroup;
  public disabled = false;
  constructor(
    public dateService: DateService,
    public tasksService: TasksService,
    public authService: AuthService
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
    this.dateService.date$.subscribe(selectedDate => {
      this.dayTasks = this.tasksService.getDayTasks(selectedDate, this.allTasks);
    });
    this.tasksService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.dayTasks = this.tasksService.getDayTasks(this.dateService.date$.value, tasks);
    });
    this.authService.currentUser.subscribe(user => this.user = user);
  }
  add(): void {
    this.disabled = true;
    const {title} = this.form.value;
    const task: Task = {title, isDone: false, date: this.dateService.date$.value.format('DD-MM-YYYY')};
    this.tasksService.create(task, this.user).subscribe(value => {
      this.disabled = false;
      this.dayTasks.push({...task, id: value.id});
      this.tasksService.tasks$.next({...this.allTasks, [this.dateService.date$.value.format('DD-MM-YYYY')]: this.dayTasks});
      this.form.reset();
    }, error => {
      this.disabled = false;
      console.error('organizer!!! submit(): ', error);
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
  remove(task: Task): void {
    this.disabled = true;
    this.tasksService.remove(task, this.user).subscribe(response => {
      const filtered = this.dayTasks.filter(el => el.id !== task.id);
      this.tasksService.tasks$.next({...this.allTasks, [this.dateService.date$.value.format('DD-MM-YYYY')]: filtered});
      this.disabled = false;
    }, error => {
      this.disabled = false;
      console.error('organizer!!! remove(): ', error);
    });
  }
}
