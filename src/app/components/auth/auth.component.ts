import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent  {
  public newUser = false;
  user = {
    displayName: '',
    email: '',
    password: '',
    confirmPass: ''
  };
  constructor(
    public authService: AuthService
  ) { }
  signIn(): void {
    this.authService.login(this.user);
    this.clear();
  }
  signUp(): void {
    if (this.user.password === this.user.confirmPass) {
      this.authService.create(this.user);
      this.clear();
    } else {
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
