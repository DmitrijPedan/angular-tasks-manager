import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { Task, CreateResponse } from '../interfaces/interfaces';
import { DB_URL } from '../constants/url';

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  public tasks$: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
    private http: HttpClient,
  ) { }
  create(task: Task, user: any): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${DB_URL}/${user.localId}/${task.date}.json/?auth=${user.idToken}`, task)
      .pipe(
        map(response => {
          return {
            ...task,
            id: response.name
          };
        })
      );
  }
  getTasks(user: any): void {
    this.http.get<Task[]>(`${DB_URL}/${user.localId}.json?auth=${user.idToken}`).subscribe(tasks => {
      if (tasks) {
        const result = {};
        Object.keys(tasks).forEach(el => {
          result[el] = Object.values(tasks[el]).map((task, i) => {
            const key = Object.keys(tasks[el])[i];
            // @ts-ignore
            return {id: key, ...task};
          });
        });
        this.tasks$.next(result);
      } else {
        this.tasks$.next(null);
      }
    }, error => {
      console.error('getTasks(): ', error);
    });
  }
  getDayTasks(date: moment.Moment, tasks): any {
    const formatDate = date.format('DD-MM-YYYY');
    if (tasks && tasks.hasOwnProperty(formatDate)) {
     return Object.values(tasks[formatDate]);
    } else {
     return [];
    }
  }
  done(task: Task, user: any): Observable<void> {
    return this.http.patch<void>(`${DB_URL}/${user.localId}/${task.date}/${task.id}.json?auth=${user.idToken}`, task);
  }
  remove(task: Task, user: any): Observable<void> {
    return this.http.delete<void>(`${DB_URL}/${user.localId}/${task.date}/${task.id}.json?auth=${user.idToken}`);
  }
}
