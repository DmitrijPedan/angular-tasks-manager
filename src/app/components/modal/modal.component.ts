import { Output, Input, Component, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() switchModalVisible = new EventEmitter();
  newUser = false;
  email: '';
  password: '';
  constructor(
    public auth: AuthService
  ) { }
  submit(): void {
    this.auth.login(this.email, this.password);
    this.switchModalVisible.emit();
  }
}
