import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { NfResume } from './models';
import { ExpeditionService } from './services/expedition.service';

@Injectable({
  providedIn: 'root',
})
export class NfsResumeResolver implements Resolve<NfResume[] | null> {
  constructor(private expeditionService: ExpeditionService) {}

  resolve(): Observable<NfResume[] | null> {
    return this.expeditionService.getNfsResume();
  }
}
