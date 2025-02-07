import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Debt } from '../modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DebtService } from '../services/debt.service';

@Component({
  selector: 'app-debt-details',
  templateUrl: './debt-details.component.html',
  styleUrls: ['./debt-details.component.scss'],
})
export class DebtDetailsComponent implements OnInit {
  debtForm: FormGroup;
  debt: Debt;
  debtId: number;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  private modalReference: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private debtService: DebtService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.debtId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.debtId) {
      this.fetchDebtDetails();
      console.log('Debt ID ===> ', this.debtId);
    } else {
      console.error('Invalid debt ID:', this.debtId);
    }
  }

  initializeForm() {
    this.debtForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nome: [{ value: '', disabled: true }],
      data_vencimento: [{ value: '', disabled: true }],
      conta: [{ value: '', disabled: true }],
      grupo: [{ value: '', disabled: true }],
      empresa: [{ value: '', disabled: true }],
      numero_parcelas: [{ value: '', disabled: true }],
      data_competencia: [{ value: '', disabled: true }],
      data_pagamento: [{ value: '', disabled: true }],
      pagamento_efetuado: [false],
      descricao: [{ value: '', disabled: true }],
      valor_total: [{ value: '', disabled: true }],
      metodo_pagamento: [{ value: '', disabled: true }],
      datas_vencimento: [{ value: '', disabled: true }],
      juros: [{ value: '', disabled: true }],
      categoria: [{ value: '', disabled: true }],
      departamento: [{ value: '', disabled: true }],
      pagamento_recorrente: [{ value: '', disabled: true }],
      periodicidade: [{ value: '', disabled: true }],
      data_criação: [{ value: '', disabled: true }],
      criado_por: [{ value: '', disabled: true }],
      status_pagamento: [{ value: '' }],
    });
  }

  private fetchDebtDetails(): void {
    this.debtService.getDebtById(this.debtId).subscribe({
      next: (debt) => {
        this.debt = debt;
        this.cdr.detectChanges();
        this.patchFormWithDebt(debt);
        console.log('Debt ===> ', this.debt);
      },
      error: (err) => {
        console.error('Error fetching debt:', err);
      },
    });
  }

  private patchFormWithDebt(debt: Debt): void {
    this.debtForm.patchValue({
      id: debt.debito_id,
      nome: debt.nome,
      data_vencimento: debt.data_competencia,
      conta: debt.conta,
      grupo: debt.despesa_grupo,
      empresa: debt.empresa,
      numero_parcelas: debt.numero_parcelas,
      data_competencia: debt.data_competencia,
      data_pagamento: debt.data_pagamento,
      pagamento_efetuado: debt.status_pagamento.status_pagamento_id === 2,
      descricao: debt.descricao,
      valor_total: debt.valor_total,
      datas_vencimento: debt.datas_vencimento,
      juros: debt.juros,
      categoria: debt.categoria.nome,
      departamento: debt.departamento.nome,
      pagamento_recorrente: debt.parcela_debito.length > 1,
      criado_por: debt.criado_por,
      status_pagamento: debt.status_pagamento.status_pagamento_id,
    });
  }

  goBack(): void {
    this.router.navigate(['/debts']);
  }

  getStatusPagClass(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'badge bg-warning'; // Pendente
      case 2:
        return 'badge bg-success'; // Pago
      case 3:
        return 'badge bg-danger'; // Atrasado
      default:
        return 'badge bg-secondary'; // Desconhecido
    }
  }
}
