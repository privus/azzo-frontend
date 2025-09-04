import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SellerBonus, WeeklyBonus } from '../models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-weekly-bonus',
  templateUrl: './weekly-bonus.component.html',
  styleUrls: ['./weekly-bonus.component.scss'],
})
export class WeeklyBonusComponent implements OnInit {
  sellers: SellerBonus[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data: WeeklyBonus = this.route.snapshot.data['bonus'];

    this.sellers = Object.entries(data).map(([sellerName, stats]) => ({
      ...stats,
      name: sellerName,
    }));
  }

  downloadExcel(): void {
    const worksheetData = this.sellers.map((s) => ({
      Vendedor: s.name,
      Bônus: s.valor_total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = { Sheets: { 'Bônus Semanais': worksheet }, SheetNames: ['Bônus Semanais'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'bonus_semanal.xlsx');
  }
}
