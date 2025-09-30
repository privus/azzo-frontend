import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from '../sellers/services/sellers.service';
import { Goals } from '../sellers/models';

@Injectable({
  providedIn: 'root',
})
export class GoalsResolver implements Resolve<Goals[] | null> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<Goals[] | null> {
    return this.sellersService.getGoals();
  }
}
