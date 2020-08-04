import { Component, OnInit } from '@angular/core';
import { DateService } from '../../shared/services/date.service';
import { ClockService } from '../../shared/services/clock.sevice';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  constructor(
    public dateService: DateService,
    public clockService: ClockService
    ) { }
  ngOnInit(): void {
    this.clockService.start();
  }
  goDay(dir: number): void {
    this.dateService.changeDay(dir);
  }
  goMonth(dir: number): void {
   this.dateService.changeMonth(dir);
  }
}


