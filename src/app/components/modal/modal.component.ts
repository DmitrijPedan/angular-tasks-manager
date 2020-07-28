import { Output, Input, Component, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() switchModalVisible = new EventEmitter();
  @Output() login = new EventEmitter<any>();
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
    this.login.emit(this.user);
    this.switchModalVisible.emit();
  }
  addNewUser(): void {
    console.log(this.user);
    this.authService.create(this.user);
  }
}
