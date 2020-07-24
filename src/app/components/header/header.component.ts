import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() switchModalVisible = new EventEmitter();
  isAuth: any;
  user: any;
  constructor(
    public auth: AuthService
  ) {  }
  ngOnInit(): void{
    this.auth.isAuth$.subscribe(value => this.isAuth = value);
    this.auth.user$.subscribe(value => this.user = value);
  }
}
