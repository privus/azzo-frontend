import { Component, OnInit } from '@angular/core';
import { Commissions } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss'],
})
export class CommissionsComponent implements OnInit {
  comission: Commissions[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.comission = this.route.snapshot.data['commissions'];
    console.log('Commissions:', this.comission);
  }
}
