import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../../core/services';
import { StatusRecord } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StatusRecordeResolver implements Resolve<StatusRecord[]> {
  constructor(private clientService: ClientService) {}

  resolve(): Observable<StatusRecord[]> {
    return this.clientService.getStatusRecord();
  }
}
