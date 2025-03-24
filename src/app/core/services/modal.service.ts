import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  open(component: any, options: any = {}) {
    return this.modalService.open(component, options);
  }

  close() {
    this.modalService.dismissAll();
  }
} 