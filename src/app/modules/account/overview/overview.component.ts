import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Usuario } from '../models/user.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  user: Usuario | null = null;
  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.accountService.user$.subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges(); // Define como false após receber os dados do usuário
    });
  }
}
