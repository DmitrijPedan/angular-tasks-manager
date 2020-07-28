import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() switchModalVisible = new EventEmitter();
  @Output() logout = new EventEmitter();
  @Input() isAuthorized: boolean;
  user = null;
  constructor(
    public authService: AuthService
  ) {  }
  ngOnInit(): void{ }
}
