import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ExportTarget = 'commissions' | 'weeklyBonus' | 'customers';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private exportSubjects: { [key in ExportTarget]: Subject<void> } = {
    commissions: new Subject<void>(),
    weeklyBonus: new Subject<void>(),
    customers: new Subject<void>(),
  };

  triggerExport(target: ExportTarget): void {
    this.exportSubjects[target].next();
  }

  onExport(target: ExportTarget) {
    return this.exportSubjects[target].asObservable();
  }
}
