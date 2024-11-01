import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getUserInfo()
  }
}
