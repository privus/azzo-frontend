import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from './services/sellers.service';
import { Commissions } from './models/commissions.model';
@Injectable({
  providedIn: 'root',
})
export class CommissionsResolver implements Resolve<Commissions | null> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<Commissions | null> {
    return this.sellersService.getCommissions();
  }
}
