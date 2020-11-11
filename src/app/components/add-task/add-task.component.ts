import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ModalService} from '../../shared/services/modal.service';
import {DateService} from '../../shared/services/date.service';
import {Task} from '../../shared/interfaces/interfaces';
import * as moment from 'moment';
import {LoaderService} from '../../shared/services/loader.service';
import {TasksService} from '../../shared/services/tasks.service';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-add-task',
  templateUrl: 'add-task.component.html',
  styleUrls: ['add-task.component.scss']
})

export class AddTaskComponent implements OnInit{
  public form: FormGroup;
  constructor(
    public modalService: ModalService,
    public authService: AuthService,
    public tasksService: TasksService,
    public dateService: DateService,
    public loaderService: LoaderService
  ) {
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }
  add(): void {
    this.loaderService.loading$.next(true);
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date$.value.format('DD-MM-YYYY'),
      isDone: false,
      selected: false,
      updated: moment(),
      deleted: false
    };
    this.tasksService.create(task, this.authService.currentUser.value).subscribe(value => {
      this.tasksService.getTasks(this.authService.currentUser.value);
      this.form.reset();
      this.loaderService.loading$.next(false);
    }, error => {
      console.error('organizer!!! submit(): ', error);
      this.loaderService.loading$.next(false);
    });
  }
  goToDate(event): void {
    const date = (moment(new Date(event.target.value)));
    this.dateService.date$.next(date);
  }
}
