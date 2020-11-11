import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() viewMode: string;
  @Output() setViewMode = new EventEmitter<string>();
  public auth = false;
  public name = '';
  constructor(
    public authService: AuthService,
    public loaderService: LoaderService,
    public taskService: TasksService,
    public modalService: ModalService,
    public dialog: MatDialog,
  ) {  }
  ngOnInit(): void{
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.auth = true;
        this.name = user.displayName !== '' ? user.displayName : user.email;
      } else {
        this.auth = false;
      }
    });
  }
  changeViewMode(mode: string): void {
    this.setViewMode.emit(mode);
  }
  confirmLogout(): void {
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
}
