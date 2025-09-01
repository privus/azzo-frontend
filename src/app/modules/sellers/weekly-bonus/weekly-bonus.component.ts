import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeeklyBonus } from '../models';

@Component({
  selector: 'app-weekly-bonus',
  templateUrl: './weekly-bonus.component.html',
  styleUrls: ['./weekly-bonus.component.scss'],
})
export class WeeklyBonusComponent implements OnInit {
  sellers: { name: string; valor_total: number; pedidos: number; clientes_novos: number }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data: WeeklyBonus = this.route.snapshot.data['bonus'];

    this.sellers = Object.entries(data).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }
}
