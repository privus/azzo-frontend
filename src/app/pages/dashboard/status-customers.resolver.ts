import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../../core/services';
import { StatusByRegion } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StatusByRegionResolver implements Resolve<StatusByRegion[]> {
  constructor(private customersService: ClientService) {}

  resolve(): Observable<StatusByRegion[]> {
    return this.customersService.getStatus();
  }
}
