import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  newUser = false;
  user = {
    email: '',
    password: '',
    displayName: ''
  };
  constructor(
    public authService: AuthService
  ) { }
  submit(): void {
    this.authService.login(this.user);
  }
  addNewUser(): void {
    console.log(this.user);
    this.authService.create(this.user);
  }
}
