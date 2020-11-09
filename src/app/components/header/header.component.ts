import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { TasksService } from '../../shared/services/tasks.service';
import { ModalService } from '../../shared/services/modal.service';

import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    public authService: AuthService,
    public loaderService: LoaderService,
    public taskService: TasksService,
    public dialog: MatDialog,
    public modalService: ModalService
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
  confirmDialog(): void {
    const dialogData = new ConfirmDialogModel('Подтвердите действие', `Вы уверены что хотите выйти?`);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.authService.logout();
      };
    });
  }
  openList(id: string): void {
    this.modalService.open(id);
  }
}
