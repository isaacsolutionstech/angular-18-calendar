import type { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [CommonModule],
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() modalKey?: string = '';
  @Output() clear = new EventEmitter<string>();

  public isVisible = false;
  private modalSubscription?: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalSubscription = this.modalService.modalState$.subscribe(
      (state) => {
        this.isVisible = this.modalKey ? state[this.modalKey] || false : false;
      }
    );
  }

  ngOnDestroy(): void {
    this.modalSubscription?.unsubscribe();
  }

  close(): void {
    if (this.modalKey) {
      this.modalService.close(this.modalKey);
    }
    this.clear.emit();
  }
}
