import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent  {
  public newUser = false;
  user = {
    displayName: '',
    email: '',
    password: '',
    confirmPass: ''
  };
  constructor(
    public authService: AuthService,
  ) { }
  signIn(): void {
    this.authService.login(this.user);
    this.clear();
  }
  signUp(): void {
    if (this.user.password === this.user.confirmPass && this.user.displayName.length >= 3) {
      this.authService.create(this.user)
        .subscribe(result => {
          this.authService.currentUser.next(result);
          this.authService.error.next(null);
          this.clear();
          this.authService.closeAuth();
        }, error => {
          this.authService.error.next(error.error.error.message);
        });
    } else if (this.user.displayName.length < 3) {
      this.authService.error.next('Имя должно быть более 3 символов');
    } else if (this.user.password !== this.user.confirmPass) {
      this.authService.error.next('Введенные пароли не совпадают');
    }
  }
  changeMode(): void {
    this.newUser = !this.newUser;
    this.clear();
    this.authService.error.next(null);
  }
  clear(): void {
    Object.keys(this.user).forEach(key => this.user[key] = '');
  }
}
