import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AccountService } from './services/account.service';
import { Usuario } from './models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<Usuario | null> {
  constructor(private accountService: AccountService) {}

  resolve(): Observable<Usuario | null> {
    return this.accountService.getUserInfo();
  }
}
