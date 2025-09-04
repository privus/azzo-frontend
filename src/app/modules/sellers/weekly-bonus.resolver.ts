import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SellersService } from './services/sellers.service';
import { WeeklyBonus } from './models';

@Injectable({
  providedIn: 'root',
})
export class WeeklyBonusResolver implements Resolve<WeeklyBonus> {
  constructor(private sellersService: SellersService) {}

  resolve(): Observable<any> {
    const today = new Date();

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay() - 7); // Sunday last week

    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(lastSunday.getDate() + 6); // Saturday last week

    const formattedFrom = lastSunday.toISOString().split('T')[0];
    const formattedTo = nextSaturday.toISOString().split('T')[0];

    return this.sellersService.getWeeklyBonus(formattedFrom, formattedTo);
  }
}
