import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssemblySessionService {
  private activeOrderCode = new BehaviorSubject<number | null>(null);

  setActiveOrder(code: number) {
    this.activeOrderCode.next(code);
  }

  getActiveOrder$() {
    return this.activeOrderCode.asObservable();
  }

  getActiveOrderSync() {
    return this.activeOrderCode.getValue();
  }

  clear() {
    this.activeOrderCode.next(null);
  }
}
