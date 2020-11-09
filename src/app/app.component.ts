import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { TasksService } from './shared/services/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  user = null;
  constructor(
    public authService: AuthService,
    public taskService: TasksService,
  ) { }
  ngOnInit(): void {
   this.authService.checkAuth();
   this.authService.currentUser.subscribe(user => this.user = user);
  }
}
