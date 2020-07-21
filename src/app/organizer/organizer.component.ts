import { Component, OnInit } from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../shared/tasks.service';
import {Task} from '../shared/tasks.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  public form: FormGroup;
  public tasks: Task[] = [];
  constructor(
    public dateService: DateService,
    public tasksService: TasksService
  ) { }
  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }
  submit(): void {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };
    this.tasksService.create(task).subscribe(value => {
      this.tasks.push(task);
      this.form.reset();
    }, err => console.error(err));
  }
  remove(task: Task): void {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(el => el.id !== task.id);
    }, (err) => console.error(err));
  }
}
