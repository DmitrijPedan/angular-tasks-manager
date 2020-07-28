import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { TasksService } from './shared/tasks.service';
import { DateService } from './shared/date.service';
import { switchMap } from 'rxjs/operators';

import { Task } from './shared/interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  public isAuthorized = false;
  public modalVisible = false;
  public user = null;
  public error: null;
  public tasks: Task[] = [];
  public allTasks: Task[] = [];
  constructor(
    public authService: AuthService,
    public tasksService: TasksService,
    public dateService: DateService
  ) { }
  ngOnInit(): void {
   this.checkUserAuthorization();
  }
  checkUserAuthorization(): void {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      this.user = savedUser;
      this.tasksService.getAll(this.user).subscribe(allTasks => {
        this.allTasks = allTasks;
      });
      this.dateService.date.pipe(
        switchMap(date => this.tasksService.load(date, this.user))
      ).subscribe(tasks => {
        this.isAuthorized = true;
        this.tasks = tasks;
      }, error => {
        this.error = error;
        this.isAuthorized = false;
        this.switchModalVisible();
        console.log('app-component init (error): ', error);
      });
    } else {
      this.isAuthorized = false;
      this.switchModalVisible();
    }
  }
  login($event): void {
    this.authService.login($event.email, $event.password).subscribe(user => {
      this.authService.setUserToLocalStorage(user);
      this.user = user;
      this.isAuthorized = true;
    }, error => {
      this.error = error.error.error.message;
      console.log('app-component login() error: ', this.error);
    });
  }
  logout(): void {
    localStorage.removeItem('user');
    this.isAuthorized = false;
    this.tasks = [];
    this.allTasks = [];
    this.checkUserAuthorization();
  }
  switchModalVisible(): void {
    this.modalVisible = !this.modalVisible;
  }
}
