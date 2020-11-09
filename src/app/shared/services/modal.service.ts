import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ModalService {
  private modals: any[] = [];
  add(modal: any): void {
    this.modals.push(modal);
  }
  remove(id: string): void {
    this.modals = this.modals.filter(el => el.id !== id);
  }
  open(id: string): void {
    const modal = this.modals.find(el => el.id === id);
    modal.open();
  }
  close(id: string): void {
    const modal = this.modals.find(el => el.id === id);
    modal.close();
  }
}


