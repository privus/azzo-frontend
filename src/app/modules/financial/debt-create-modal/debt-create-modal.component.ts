import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebtService } from '../services/debt.service';
import { Categoria, Departamento, NewDebt } from '../modal';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-debt-create-modal',
  templateUrl: './debt-create-modal.component.html',
  styleUrls: ['./debt-create-modal.component.scss'],
})
export class DebtCreateModalComponent implements OnInit {
  debtForm: FormGroup;
  departments: Departamento[];
  categories: Categoria[];
  userEmail: string = '';
  showCategoryInput: boolean = false;
  showDepartmentInput: boolean = false;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private debtService: DebtService,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.initializeForm();
    this.loadDepartments();
    this.loadCategories();
  }

  private loadDepartments(): void {
    this.debtService.getAllDepartaments().subscribe((department) => {
      this.departments = department;
    });
  }

  private loadCategories(): void {
    this.debtService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  initializeForm() {
    this.debtForm = this.fb.group({
      nome: ['', [Validators.required]],
      data_vencimento: [new Date().toISOString().substring(0, 10), [Validators.required]],
      conta: ['', [Validators.required]],
      grupo: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      numero_parcelas: [null, [Validators.required, Validators.min(1)]],
      data_competencia: [new Date().toISOString().substring(0, 10), [Validators.required]],
      data_pagamento: ['', [Validators.required]],
      pagamento_efetuado: [false],
      descricao: ['', [Validators.required]],
      valor_total: [null, [Validators.required, Validators.min(0.01)]],
      metodo_pagamento: ['', [Validators.required]],
      datas_vencimento: ['', [Validators.required]],
      juros: [null, [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]],
      categoria_nome: [''],
      departamento_id: ['', [Validators.required]],
      departamento_nome: [''],
      pagamento_recorrente: [false],
      periodicidade: [null, [Validators.required]],
    });
  }

  submitForm() {
    if (this.debtForm) {
      const newDebt = this.debtForm.value;
      const formattedDebt: NewDebt = {
        nome: newDebt.nome,
        descricao: newDebt.descricao,
        data_competencia: newDebt.data_competencia,
        categoria_id: Number(newDebt.categoria_id),
        categoria_nome: newDebt.categoria_nome || null,
        data_pagamento: newDebt.data_pagamento || null,
        data_vencimento: newDebt.data_vencimento,
        departamento_id: Number(newDebt.departamento_id),
        departamento_nome: newDebt.departamento_nome || null,
        empresa_grupo: newDebt.empresa,
        grupo: Number(newDebt.grupo),
        juros: Number(newDebt.juros),
        conta: newDebt.conta,
        numero_parcelas: Number(newDebt.numero_parcelas),
        periodicidade: Number(newDebt.periodicidade),
        valor_total: Number(newDebt.valor_total),
        criado_por: this.userEmail,
      };
      console.log('Formatted debt:', formattedDebt);
      this.debtService.createDebt(formattedDebt).subscribe(() => {
        this.activeModal.close('Debt created');
      });
    } else {
      console.log('Form is invalid');
    }
  }

  toggleCategoryInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showCategoryInput = value === '';
  }

  toggleDepartmentInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.showDepartmentInput = value === '';
  }
}
