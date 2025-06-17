import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ranking } from '../models/order.model';

@Component({
  selector: 'app-seller-ranking-modal',
  templateUrl: './seller-ranking-modal.component.html',
  styleUrls: ['./seller-ranking-modal.component.scss'],
})
export class SellerRankingModalComponent implements OnInit {
  @Input() ranking: Ranking | null = null;
  groupKeys: Array<keyof Ranking> = ['today', 'yesterday'];
  isLoading = false;

  constructor(
    private orderService: OrderService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    if (!this.ranking || (!this.ranking.today?.length && !this.ranking.yesterday?.length)) {
      this.loadRanking();
    }
  }

  getMaxPureliSeller(sellers: any[]): number {
    const sorted = [...sellers].sort((a, b) => b.pureli - a.pureli);
    return sorted.length > 0 && sorted[0].pureli > 0 ? sorted[0].id : -1;
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
        this.isLoading = false;
      },
    });
  }
}
