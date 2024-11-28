import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { Usuario } from './models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user: Usuario | null = null;
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  mesAtual = this.meses[new Date().getMonth()];

  constructor(private accountService: AccountService) {}

  async ngOnInit(): Promise<void> {
    this.accountService.getUserInfo().subscribe((user) => (this.user = user));
  }
}
