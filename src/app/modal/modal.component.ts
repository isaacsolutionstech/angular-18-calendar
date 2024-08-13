import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [CommonModule],
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  isVisible = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalState$.subscribe((state) => {
      this.isVisible = state;
    });
  }

  close(): void {
    this.modalService.open();
  }
}
