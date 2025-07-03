import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PGenerateCredit } from '../../financial/models';

@Component({
  selector: 'app-generate-installments-modal',
  templateUrl: './generate-installments-modal.component.html',
})
export class GenerateInstallmentsModalComponent implements OnInit {
  @Input() valorTotal: number = 0;
  @Input() dataPedido: string = ''; // 'yyyy-MM-dd'
  form: FormGroup;
  parcelasArray: PGenerateCredit[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      qtdParcelas: [1, [Validators.required, Validators.min(1)]],
    });

    // Atualiza quando qualquer campo de valor mudar (opcional, para algum efeito reativo extra)
    for (let i = 0; i < 24; i++) {
      this.form.get('valor' + i)?.valueChanges?.subscribe(() => {
        // Isso força o Angular a reprocessar o getter totalParcelas
      });
    }

    this.form.get('qtdParcelas')?.valueChanges.subscribe((qtd) => {
      this.createParcelas(qtd);
    });
    console.log('Valor total:', this.valorTotal);
    console.log('total parcelas', this.totalParcelas);

    // Inicializa parcelas ao abrir o modal
    this.createParcelas(1);
  }

  createParcelas(qtd: number) {
    this.parcelasArray = Array.from({ length: qtd });
    const valorBase = +(this.valorTotal / qtd).toFixed(2);

    for (let i = 0; i < qtd; i++) {
      // Valor
      if (!this.form.contains('valor' + i)) {
        this.form.addControl('valor' + i, this.fb.control(valorBase, [Validators.required, Validators.min(0.01)]));
      } else {
        this.form.get('valor' + i)?.setValue(valorBase, { emitEvent: false });
      }

      // Vencimento
      if (!this.form.contains('data_vencimento' + i)) {
        this.form.addControl('data_vencimento' + i, this.fb.control('', Validators.required));
      }
      // Competência
      if (!this.form.contains('data_competencia' + i)) {
        this.form.addControl('data_competencia' + i, this.fb.control(this.dataPedido, Validators.required));
      } else {
        this.form.get('data_competencia' + i)?.setValue(this.dataPedido, { emitEvent: false });
      }

      // Checkbox pagamento efetuado
      if (!this.form.contains('pagamento_efetuado' + i)) {
        this.form.addControl('pagamento_efetuado' + i, this.fb.control(false));
      }

      // Se o controle já existe, não adiciona novamente, mas escuta mudanças
      this.form.get('pagamento_efetuado' + i)?.valueChanges.subscribe((checked) => {
        const pagamentoControl = 'data_pagamento' + i;
        if (checked) {
          if (!this.form.contains(pagamentoControl)) {
            this.form.addControl(pagamentoControl, this.fb.control('', Validators.required));
          }
        } else {
          if (this.form.contains(pagamentoControl)) {
            this.form.removeControl(pagamentoControl);
          }
        }
      });
    }
    // Remove extras se diminuiu
    let i = qtd;
    while (this.form.contains('valor' + i)) {
      this.form.removeControl('valor' + i);
      i++;
    }
    i = qtd;
    while (this.form.contains('data_vencimento' + i)) {
      this.form.removeControl('data_vencimento' + i);
      i++;
    }
    i = qtd;
    while (this.form.contains('data_competencia' + i)) {
      this.form.removeControl('data_competencia' + i);
      i++;
    }
    i = qtd;
    while (this.form.contains('pagamento_efetuado' + i)) {
      this.form.removeControl('pagamento_efetuado' + i);
      i++;
    }
    i = qtd;
    while (this.form.contains('data_pagamento' + i)) {
      this.form.removeControl('data_pagamento' + i);
      i++;
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  get totalParcelas(): number {
    const qtd = this.form.get('qtdParcelas')?.value;
    let total = 0;
    for (let i = 0; i < qtd; i++) {
      const val = parseFloat(this.form.get('valor' + i)?.value || '0');
      if (!isNaN(val)) total += val;
    }
    return total;
  }

  confirmar() {
    if (this.form.valid) {
      const qtd = this.form.get('qtdParcelas')?.value;
      const parcelas: PGenerateCredit[] = [];
      for (let i = 0; i < qtd; i++) {
        const data_pagamento = this.form.get('pagamento_efetuado' + i)?.value ? this.form.get('data_pagamento' + i)?.value : null;
        parcelas.push({
          valor: this.form.get('valor' + i)?.value,
          numero: i + 1,
          data_vencimento: this.form.get('data_vencimento' + i)?.value,
          data_competencia: this.form.get('data_competencia' + i)?.value,
          data_pagamento: data_pagamento,
        });
      }
      this.activeModal.close(parcelas);
    }
  }

  isTotalIgualPedido(): boolean {
    return Math.abs(this.totalParcelas - this.valorTotal) < 0.01;
  }
}
