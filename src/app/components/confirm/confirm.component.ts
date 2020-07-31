import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent {
  @Input() message = 'Are you sure?';
  @Output() cancel = new EventEmitter();
  @Output() action = new EventEmitter();
}
