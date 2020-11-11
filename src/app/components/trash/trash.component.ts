import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { TasksService } from '../../shared/services/tasks.service';
import { Task } from '../../shared/interfaces/interfaces';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';


@Component({
  selector: 'app-trash',
  templateUrl: 'trash.component.html',
  styleUrls: ['trash.component.scss'],
})

export class TrashComponent implements OnInit {
  public allTasks = [];
  public selectedTasks = [];
  public allTasksSelected = false;
  constructor(
    private authService: AuthService,
    public loaderService: LoaderService,
    public modalService: ModalService,
    public tasksService: TasksService,
    public dialog: MatDialog
  ) {
  }
  ngOnInit(): void {
    this.tasksService.trash$.subscribe(result => {
      this.allTasks = result;
    });
  }
  selectTask(task: Task): void {
    this.allTasks.forEach(el => {
      if (el.id === task.id) {
        el.selected = !el.selected;
      }
    });
    const filtered = this.allTasks.filter(el => el.selected);
    this.selectedTasks = filtered;
    this.allTasksSelected = filtered.length === this.allTasks.length;
  }
  selectAll(): void {
    if (this.selectedTasks.length === this.allTasks.length) {
      this.allTasks.forEach(el => el.selected = false);
      this.selectedTasks = [];
      this.allTasksSelected = false;
    } else {
      this.allTasks.forEach(el => el.selected = true);
      this.selectedTasks = this.allTasks;
      this.allTasksSelected = true;
    }
  }
  deleteSelectedTasks(): void {
    if (this.selectedTasks.length) {
      this.loaderService.loading$.next(true);
      forkJoin(
        this.selectedTasks.map(el => this.tasksService.delete(el, this.authService.currentUser.value))
      ).subscribe(result => {
        this.tasksService.getTasks(this.authService.currentUser.value);
        this.selectedTasks = [];
        this.loaderService.loading$.next(false);
      }, error => {
        console.error('fork join err: ', error);
        this.loaderService.loading$.next(false);
      });
    } else {
      return;
    }
  }
  confirmDelete(): void {
    const dialogData = new ConfirmDialogModel('Подтвердите действие', 'Вы уверены что хотите навсегда удалить выбранные задачи?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
       this.deleteSelectedTasks();
      }
    });
  }
  restoreSelectedTasks(): void {
    if (this.selectedTasks.length) {
      this.loaderService.loading$.next(true);
      forkJoin(
        this.selectedTasks.map(el => this.tasksService
          .patch({...el, deleted: false, selected: false}, this.authService.currentUser.value))
      ).subscribe(result => {
        this.tasksService.getTasks(this.authService.currentUser.value);
        this.selectedTasks = [];
        this.loaderService.loading$.next(false);
      }, error => {
        console.error('restoreSelectedTasks err: ', error);
        this.loaderService.loading$.next(false);
      });
    }
  }
  sort(key: string): void {
    // console.log(key);
    this.allTasks.sort((a, b) => {
      if (this.allTasks[0][key] > this.allTasks[this.allTasks.length - 1][key]) {
        return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      }
      else {
        return a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0;
      }
    });
  }
}
