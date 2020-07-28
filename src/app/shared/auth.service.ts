import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable } from 'rxjs';

import { SIGN_IN_URL, SIGN_UP_URL } from './constants/url';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private http: HttpClient
  ) { }
  create(user: any): any {
    this.http.post(`${SIGN_UP_URL}?key=${environment.firebase.apiKey}`, {
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      returnSecureToken: true})
      .subscribe(result => {
        this.currentUser.next(result);
        this.isAuthorized.next(true);
        console.log('Create new user current User: ', this.currentUser);
        console.log('Create new user isAuthorized: ', this.isAuthorized);
      }, error => {
        console.log('Create new user: ', error);
      });
  }
  login(email: string, password: string): Observable<any>{
    return this.http.post(`${SIGN_IN_URL}?key=${environment.firebase.apiKey}`, {email, password, returnSecureToken: true});
  }
  setUserToLocalStorage(user): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
