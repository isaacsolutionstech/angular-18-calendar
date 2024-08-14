import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<{ [key: string]: boolean }>({});
  modalState$ = this.modalState.asObservable();

  public open(key: string): void {
    const currentState = this.modalState.value;
    this.modalState.next({ ...currentState, [key]: true });
  }

  public close(key: string): void {
    const currentState = this.modalState.value;
    this.modalState.next({ ...currentState, [key]: false });
  }
}
