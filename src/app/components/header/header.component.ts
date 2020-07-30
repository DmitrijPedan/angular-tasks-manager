import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public auth = false;
  public name = '';
  public email = '';
  constructor(
    public authService: AuthService
  ) {  }
  ngOnInit(): void{
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.auth = true;
        this.name = user.displayName;
        this.email = user.email;
      } else {
        this.auth = false;
        this.name = '';
        this.email = '';
      }
    });
  }
}
