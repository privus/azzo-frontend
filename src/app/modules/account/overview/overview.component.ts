import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Usuario } from '../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  user: Usuario | null = null;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
