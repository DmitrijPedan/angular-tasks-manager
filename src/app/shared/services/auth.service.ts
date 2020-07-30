import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import {DB_URL, SIGN_IN_URL, SIGN_UP_URL} from '../constants/url';
import { environment } from '../../../environments/environment';
import {TasksService} from './tasks.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public error: BehaviorSubject<any> = new BehaviorSubject(null);
  public authWindow: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private tasksService: TasksService
  ) { }
  create(user: any): any {
    return this.http.post(`${SIGN_UP_URL}?key=${environment.firebase.apiKey}`, {
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      returnSecureToken: true});
  }
  login(user): void{
    this.http.post(`${SIGN_IN_URL}?key=${environment.firebase.apiKey}`, {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    })
      .subscribe(response => {
        this.currentUser.next(response);
        this.setUserToLocalStorage(response);
        this.tasksService.getTasks(response);
        this.error.next(null);
        this.closeAuth();
      }, error => {
        this.error.next(error.error.error.message);
      });
  }
  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.tasksService.tasks$.next([]);
    this.showAuth();
  }
  checkAuth(): void {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      this.http.get(`${DB_URL}/${savedUser.localId}.json?auth=${savedUser.idToken}`).subscribe(response => {
        this.currentUser.next(savedUser);
        this.tasksService.getTasks(savedUser);
      }, error => {
        console.error('AuthService => checkAuth(): ', error);
        this.error.next(error.error.error.message);
        this.currentUser.next(null);
        this.tasksService.tasks$.next([]);
        this.showAuth();
      });
    } else {
      this.showAuth();
    }
  }
  setUserToLocalStorage(user): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  showAuth(): void {
    this.authWindow.next(true);
  }
  closeAuth(): void {
    this.authWindow.next(false);
  }
}
