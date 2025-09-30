import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ranking } from '../models';
import { Goals } from '../../sellers/models';
import { SellersService } from '../../sellers/services/sellers.service';

@Component({
  selector: 'app-seller-ranking-modal',
  templateUrl: './seller-ranking-modal.component.html',
  styleUrls: ['./seller-ranking-modal.component.scss'],
})
export class SellerRankingModalComponent implements OnInit {
  @Input() ranking: Ranking | null = null;
  @Input() meta: Goals[] = [];
  groupKeys: Array<keyof Ranking> = ['today', 'yesterday'];
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private sellersService: SellersService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.loadRanking();
  }

  getMaxPureliSeller(sellers: any[]): number {
    const sorted = [...sellers].sort((a, b) => b.pureli - a.pureli);
    return sorted.length > 0 && sorted[0].pureli > 0 ? sorted[0].id : -1;
  }

  getSellerGoal(nome: string) {
    const goal = this.meta.find((m) => m.vendedor === nome);
    if (!goal) return null;

    return {
      meta_ped: goal.meta_ped,
      meta_fat: goal.meta_fat,
      progress_ped: goal.progress_ped,
      progress_fat: goal.progress_fat,
      ped_realizados: goal.ped_realizados,
      fat_realizado: goal.fat_realizado,
    };
  }

  loadRanking(): void {
    this.isLoading = true;
    this.orderService.getSellerRanking().subscribe({
      next: (data) => {
        this.ranking = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar ranking:', err);
      },
    });
    this.sellersService.getGoals().subscribe({
      next: (data) => {
        this.meta = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar metas:', err);
      },
    });
  }
}
