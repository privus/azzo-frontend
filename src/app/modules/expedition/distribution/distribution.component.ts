import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
})
export class DistributionComponent implements OnInit {
  romaneioForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.romaneioForm = this.fb.group({
      pedidos: this.fb.array([]),
    });
  }
  ngOnInit(): void {}
}
