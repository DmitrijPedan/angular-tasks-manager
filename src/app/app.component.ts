import { Component, OnInit, Injector } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  user = null;
  modalVisible = false;
  constructor(
    public authService: AuthService,
  ) { }
  ngOnInit(): void {
   this.authService.checkAuth();
   this.authService.currentUser.subscribe(user => this.user = user);
   this.authService.authWindow.subscribe(value => this.modalVisible = value);
  }

}
