import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  $showTrash: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $showAddTask: BehaviorSubject<boolean> = new BehaviorSubject(false);
  $showAuth: BehaviorSubject<boolean> = new BehaviorSubject(false);
}


