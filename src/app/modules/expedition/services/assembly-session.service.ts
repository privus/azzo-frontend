import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrderAssemblyCardComponent } from '../order-assembly-card/order-assembly-card.component';

@Injectable({ providedIn: 'root' })
export class AssemblySessionService {
  private activeOrderCode = new BehaviorSubject<number | null>(null);
  private orderSwitch = new Subject<number>();
  private pendingSaveResolvers: (() => void)[] = [];
  private activeComponent: OrderAssemblyCardComponent | null = null;

  setActiveOrder(code: number) {
    const oldCode = this.activeOrderCode.getValue();
    if (oldCode && oldCode !== code) {
      this.orderSwitch.next(oldCode);
    }
    this.activeOrderCode.next(code);
  }

  clearActiveOrder() {
    this.activeOrderCode.next(null);
  }

  getActiveOrder$() {
    return this.activeOrderCode.asObservable();
  }

  getActiveOrderSync() {
    return this.activeOrderCode.getValue();
  }

  onOrderSwitch$() {
    return this.orderSwitch.asObservable();
  }

  waitPreviousSave(): Promise<void> {
    return new Promise((resolve) => {
      this.pendingSaveResolvers.push(resolve);
      this.orderSwitch.next(this.getActiveOrderSync()!);
    });
  }

  confirmSaveComplete() {
    for (const resolver of this.pendingSaveResolvers) resolver();
    this.pendingSaveResolvers = [];
  }
}
