import {Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';

import {AuthService} from './auth.service';
import { Task, CreateResponse } from '../shared/interfaces/interfaces';
import { DB_URL } from './constants/url';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
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
  load(date: moment.Moment, user: any): Observable<Task[]> {
    const result = this.http.get<Task[]>(`${DB_URL}/${user.localId}/${date.format('DD-MM-YYYY')}.json?auth=${user.idToken}`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map(key => ({
            ...tasks[key],
            id: key
          }));
        })
      );
    return result;
  }
  getAll(user: any): Observable<Task[]> {
     const result = this.http.get<Task[]>(`${DB_URL}/${user.localId}.json?auth=${user.idToken}`)
       .pipe(
         map(tasks => {
           if (tasks) {
             return tasks;
           } else {
             return [];
           }
         })
       );
     return result;
  }
  done(task: Task, user: any): Observable<void> {
    return this.http.patch<void>(`${DB_URL}/${user.localId}/${task.date}/${task.id}.json?auth=${user.idToken}`, task);
  }
  remove(task: Task, user: any): Observable<void> {
    return this.http.delete<void>(`${DB_URL}/${user.localId}/${task.date}/${task.id}.json?auth=${user.idToken}`);
  }
}
