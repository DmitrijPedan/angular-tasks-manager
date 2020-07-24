import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

import { environment } from '../../environments/environment';
import * as firebase from 'firebase';

export interface User {
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  returnSecureToken: boolean;
}

export interface CurrentUser {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: true;
  refreshToken: string;
  expiresIn: string;
}

// Initialize Firebase
firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
  isAuth$ = new Subject();
  user$ = new Subject();
  user = null;
  error = null;
  constructor(private http: HttpClient) {
  }
  create(email: string, password: string): any {
   firebase.auth().createUserWithEmailAndPassword(email, password)
     .then(res => {
       console.log('result: ', res);
     })
     .catch( error => {
       console.log(error.code, error.message);
   });
  }

  login(email: string, password: string): any{
    this.http
      .post(`${this.loginUrl}?key=${environment.firebase.apiKey}`, {email, password, returnSecureToken: true})
      .subscribe(res => {
        this.setDataToLocalStorage(res);
        this.user$.next(res);
        this.user = res;
        this.isAuth$.next(true);
      }, error => {
        this.error = error.error.error.message;
        console.log('app-component login() error: ', this.error);
      });
  }
  setDataToLocalStorage(user): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  checkAuthUser(): any {
    const data = JSON.parse(localStorage.getItem('user'));
    if (data) {
      this.user$.next(data);
      this.user = data;
      console.log('check', data);
      this.isAuth$.next(true);
      // return data;
    }
  }
  logout(): void {
    localStorage.removeItem('user');
    this.isAuth$.next(false);
    this.user$.next(null);
    this.user = null;
  }
}
