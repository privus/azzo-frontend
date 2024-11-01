import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { Usuario } from './models/user.model';
 
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user: Usuario | null = null;

  constructor(private accountService: AccountService) {}

  async ngOnInit(): Promise<void> {
    this.accountService.getUserInfo().subscribe(user => this.user = user);
  }
}
