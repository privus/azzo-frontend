import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Romaneio } from './models';
import { ExpeditionService } from './services/expedition.service';

@Injectable({
  providedIn: 'root',
})
export class RomaneioResolver implements Resolve<Romaneio[] | null> {
  constructor(private expeditionService: ExpeditionService) {}

  resolve(): Observable<Romaneio[] | null> {
    return this.expeditionService.getRomaneio();
  }
}
