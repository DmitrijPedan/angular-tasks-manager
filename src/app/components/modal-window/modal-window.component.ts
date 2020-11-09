import {Component, OnInit, ViewEncapsulation, ElementRef, Input, OnDestroy} from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { TasksService } from '../../shared/services/tasks.service';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalWindowComponent implements OnInit, OnDestroy {
  @Input() id: string;
  public element: any;
  public allTasks: any = [];

  constructor(
    public modalService: ModalService,
    public tasksService: TasksService,
    private el: ElementRef
  ) {this.element = el.nativeElement; }

  ngOnInit(): void {

    this.tasksService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
    });
    if (!this.id) {
      console.error('modal must have an id!');
      return;
    }
    document.body.appendChild(this.element);
    this.element.addEventListener('click', event => {
      if (event.target.className === 'task-list') {
        this.close();
      }
    });
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  // open modal
  open(): void {
    this.element.style.display = 'block';
  }
  // close modal
  close(): void {
    this.element.style.display = 'none';
  }

}
