import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoalsRanking } from '../models';
import { SellersService } from '../services/sellers.service';

@Component({
  selector: 'app-goals-ranking-modal',
  templateUrl: './goals-ranking-modal.component.html',
  styleUrls: ['./goals-ranking-modal.component.scss'],
})
export class GoalsRankingModalComponent implements OnInit {
  ranking: GoalsRanking[] = [];
  isLoading = false;

  constructor(
    private sellersService: SellersService,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.loadGoalsRanking();
  }

  loadGoalsRanking(): void {
    this.isLoading = true;

    this.sellersService.getGoalsRanking().subscribe({
      next: (data) => {
        this.ranking = data.sort((a, b) => b.progress - a.progress);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar ranking de metas:', err);
        this.isLoading = false;
      },
    });
  }
}
