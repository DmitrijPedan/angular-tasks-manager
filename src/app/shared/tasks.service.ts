import {Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {AuthService} from './auth.service';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}
interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  static url = 'https://angular-tasks-manager.firebaseio.com/users';
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }
  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${this.auth.user.localId}/${task.date}.json/?auth=${this.auth.user.idToken}`, task)
      .pipe(
        map(response => {
          return {
            ...task,
            id: response.name
          };
        })
      );
  }
  load(date: moment.Moment): Observable<Task[]> {
    const result = this.http
      .get<Task[]>(`${TasksService.url}/${this.auth.user.localId}/${date.format('DD-MM-YYYY')}.json?auth=${this.auth.user.idToken}`)
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
  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${this.auth.user.localId}/${task.date}/${task.id}.json?auth=${this.auth.user.idToken}`);
  }
}
