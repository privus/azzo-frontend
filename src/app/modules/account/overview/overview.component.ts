import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  user: Usuario | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];
  }
}
