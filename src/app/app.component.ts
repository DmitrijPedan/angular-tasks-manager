import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { TasksService } from './shared/services/tasks.service';
import { ModalService } from './shared/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  public user = null;
  public viewMode = '';
  constructor(
    public authService: AuthService,
    public taskService: TasksService,
    public modalService: ModalService,
  ) { }
  ngOnInit(): void {
    this.authService.checkAuth();
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      this.setViewMode('calendar');
    } );
  }
  setViewMode(mode: string): void {
    this.viewMode = mode;
  }
}
