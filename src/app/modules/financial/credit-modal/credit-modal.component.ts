import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditService } from '../services/credit.service';
import { Credit, UpdateInstallment } from '../modal';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-credit-modal',
  templateUrl: './credit-modal.component.html',
  styleUrls: ['./credit-modal.component.scss'],
})
export class CreditModalComponent implements OnInit {
  @Input() parcelaModel: Credit;
  @Output() onModalClose: EventEmitter<void> = new EventEmitter(); // Evento de saída para notificar o fechamento
  userEmail: string = '';
  obs: string = '';
  isPaymentDateDisabled: boolean = false;

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private activeModal: NgbActiveModal,
    private creditService: CreditService,
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const storageInfo = this.localStorage.get('STORAGE_MY_INFO');
    this.userEmail = storageInfo ? JSON.parse(storageInfo).email : '';
    this.onStatusChange();
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }

  showAlert(swalOptions: SweetAlertOptions, callback?: () => void) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then(() => {
      if (callback) {
        callback();
      }
    });
  }

  onSubmit(): void {
    // Verifica se a justificativa é obrigatória
    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '')) {
      this.showAlert({
        icon: 'warning',
        title: 'Justificativa Obrigatória',
        text: 'Por favor, insira uma justificativa para o cancelamento.',
        confirmButtonText: 'Ok',
      });
      return; // Impede o envio do formulário
    }

    const updateData: UpdateInstallment = {
      parcela_id: this.parcelaModel.parcela_id,
      status_pagamento_id: +this.parcelaModel.status_pagamento.status_pagamento_id,
      data_pagamento: this.parcelaModel.data_pagamento ?? '',
      juros: this.parcelaModel.juros ? Number(this.parcelaModel.juros) : 0,
      atualizado_por: this.userEmail,
      obs: this.obs,
    };

    this.creditService.UpdateInstallment(updateData).subscribe({
      next: (resp) => {
        this.showAlert(
          {
            icon: 'success',
            title: 'Parcela atualizada com sucesso!',
            text: resp.message,
            confirmButtonText: 'Ok',
          },
          () => {
            this.activeModal.close('success');
            window.location.reload(); // Recarrega a página inteira
          },
        );
      },
      error: (err) => {
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o pedido.',
          confirmButtonText: 'Ok',
        });
        console.error(err);
      },
    });
  }

  onStatusChange(): void {
    if (+this.parcelaModel.status_pagamento.status_pagamento_id === 3) {
      this.isPaymentDateDisabled = true;
      this.parcelaModel.data_pagamento = null; // Define como null se "Em Atraso"
    } else {
      this.isPaymentDateDisabled = false;
    }
  }

  isJustificationRequired(): boolean {
    return +this.parcelaModel.status_pagamento.status_pagamento_id === 4 && (!this.obs || this.obs.trim() === '');
  }
}
