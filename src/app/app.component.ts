import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isAuth: any;
  modalVisible = false;
  data: any;
  constructor(
    public auth: AuthService,
  ) { }
  ngOnInit(): void {
    this.auth.checkAuthUser();
    this.auth.isAuth$.subscribe(value => {
      this.isAuth = value;
    });
  }
  switchModalVisible(): void {
    this.modalVisible = !this.modalVisible;
  }
}
