import { Component, OnInit } from '@angular/core';

import { DateService } from '../../shared/services/date.service';
import { TasksService } from '../../shared/services/tasks.service';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { Task } from '../../shared/interfaces/interfaces';
import { forkJoin } from 'rxjs';

import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit {
  public allTasks: any = [];
  public dayTasks: Task[] = [];
  public selectedTasks = [];
  public user = null;
  constructor(
    public dateService: DateService,
    public tasksService: TasksService,
    public authService: AuthService,
    public loaderService: LoaderService,
    public dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.dateService.date$.subscribe(selectedDate => {
      this.dayTasks = this.tasksService.getDayTasks(selectedDate, this.allTasks);
    });
    this.tasksService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.dayTasks = this.tasksService.getDayTasks(this.dateService.date$.value, tasks);
    });
    this.authService.currentUser.subscribe(user => this.user = user);
  }
  checkDone(): void {
   if (this.selectedTasks.length) {
      this.loaderService.loading$.next(true);
      forkJoin(
        this.selectedTasks.map(el => this.tasksService.patch({...el, isDone: true, selected: false}, this.user))
      ).subscribe(result => {
        this.tasksService.getTasks(this.authService.currentUser.value);
        this.loaderService.loading$.next(false);
      }, error => {
        console.log('fork join err: ', error);
        this.loaderService.loading$.next(false);
      });
    }
  }
  toTrash(): void {
    if (this.selectedTasks.length) {
      this.loaderService.loading$.next(true);
      forkJoin(
        this.selectedTasks.map(el => this.tasksService.patch({...el, deleted: true, selected: false}, this.user))
      ).subscribe(result => {
        this.tasksService.getTasks(this.authService.currentUser.value);
        this.loaderService.loading$.next(false);
      }, error => {
        console.log('fork join err: ', error);
        this.loaderService.loading$.next(false);
      });
    }
  }
  confirmToTrash(): void {
    const dialogData = new ConfirmDialogModel('Подтвердите действие', 'Вы уверены что хотите переместить выбранные заметки в корзину?');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toTrash();
      }
    });
  }
  selectTask(task: Task): void {
    console.log(task);
    this.dayTasks.forEach(el => {
      if (el.id === task.id) {
        el.selected = !el.selected;
      }
    });
    const filtered = this.dayTasks.filter(el => el.selected);
    this.selectedTasks = filtered;
  }
  selectAll(): void {
    if (this.selectedTasks.length === this.allTasks.length) {
      this.allTasks.forEach(el => el.selected = false);
      this.selectedTasks = [];
    } else {
      this.allTasks.forEach(el => el.selected = true);
      this.selectedTasks = this.allTasks;
    }
  }
}
