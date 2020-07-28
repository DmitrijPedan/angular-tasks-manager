import { Component, OnInit, Input } from '@angular/core';
import {DateService} from '../../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../../shared/tasks.service';
import {Task} from '../../shared/interfaces/interfaces';
import * as moment from 'moment';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() user = null;
  public form: FormGroup;
  public disabled = false;
  constructor(
    public dateService: DateService,
    public tasksService: TasksService
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
    this.dateService.date.next(moment());
  }
  submit(): void {
    const {title} = this.form.value;
    const task: Task = {
      title,
      isDone: false,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.tasksService.create(task, this.user).subscribe(value => {
      this.tasks.push(task);
      this.form.reset();
    }, err => console.error(err));
  }
  done(task: Task): void {
    this.disabled = true;
    this.tasksService.done({...task, isDone: !task.isDone}, this.user).subscribe(() => {
      this.tasks.map(el => el.id === task.id ? el.isDone = !el.isDone : null);
      this.disabled = false;
    }, (error) => {
      console.error('organizer!!! done(): ', error);
      this.disabled = false;
    });
  }
  remove(task: Task): void {
    this.disabled = true;
    this.tasksService.remove(task, this.user).subscribe(() => {
      this.tasks = this.tasks.filter(el => el.id !== task.id);
      this.disabled = false;
    }, (err) => {
        console.error(err);
        this.disabled = false;
    });
  }
}
