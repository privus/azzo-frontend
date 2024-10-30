import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/user.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  user: Usuario | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.getUserInfo(); // Chama o método getUserInfo ao iniciar o componente
  }

  getUserInfo(): void {
    this.accountService.getUserInfo().subscribe((user) => {
      this.user = user;
      console.log('USER ====>>>>', user)
    });
  }
}
