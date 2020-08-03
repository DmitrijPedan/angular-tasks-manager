import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import * as moment from 'moment';

import { Task, CreateResponse } from '../interfaces/interfaces';
import { DB_URL } from '../constants/url';
import {LoaderService} from './loader.service';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  public tasks$: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) { }
  create(task: Task, user: any): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${DB_URL}/${user.localId}/tasks.json/?auth=${user.idToken}`, task)
      .pipe(
        map(response => {
          return {...task, id: response.name};
        })
      );
  }
  getTasks(user: any): void {
    this.loaderService.loading$.next(true);
    this.http.get<Task[]>(`${DB_URL}/${user.localId}/tasks.json?auth=${user.idToken}`).subscribe(tasks => {
      if (tasks) {
        const result = Object.keys(tasks).map(el => ({...tasks[el], id: el, selected: false}));
        this.tasks$.next(result);
        this.loaderService.loading$.next(false);
      } else {
        this.tasks$.next(null);
        this.loaderService.loading$.next(false);
      }
    }, error => {
      console.error('getTasks(): ', error);
    });
  }
  getDayTasks(date: moment.Moment, tasks): any {
    const formatDate = date.format('DD-MM-YYYY');
    const result = tasks.filter(el => el.date === formatDate).sort((a, b) => a.isDone - b.isDone);
    return result ? result : [];
  }
  done(task: Task, user: any): Observable<void> {
    return this.http
      .patch<void>(`${DB_URL}/${user.localId}/tasks/${task.id}.json?auth=${user.idToken}`, task);
  }
  remove(task: Task, user: any): Observable<void> {
    return this.http
      .delete<void>(`${DB_URL}/${user.localId}/tasks/${task.id}.json?auth=${user.idToken}`);
  }
}
