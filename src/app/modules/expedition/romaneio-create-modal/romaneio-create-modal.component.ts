import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpeditionService } from '../services/expedition.service';
import { NewRomaneio, Transportadora } from '../models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-romaneio-create-modal',
  templateUrl: './romaneio-create-modal.component.html',
  styleUrls: ['./romaneio-create-modal.component.scss'],
})
export class RomaneioCreateModalComponent implements OnInit {
  romaneioForm: FormGroup;
  transportadora: Transportadora[] = [];
  showTransInput = false;
  @ViewChild('firstFocusable', { static: false }) firstFocusable!: ElementRef;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private expeditionService: ExpeditionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.romaneioForm = this.fb.group({
      vendas: ['', Validators.required],
      transportadora_id: [''],
      transportadora_nome: [''],
      data_criacao: [new Date().toISOString().substring(0, 10), [Validators.required]],
    });

    this.expeditionService.getAllTrans().subscribe((transportadora) => {
      this.transportadora = transportadora;
    });
  }

  submitForm() {
    if (this.romaneioForm.valid) {
      const value = this.romaneioForm.value;

      const codigos = value.vendas
        .split(',')
        .map((codigo: string) => Number(codigo.trim()))
        .filter((codigo: number) => !isNaN(codigo));

      const payload: NewRomaneio = {
        codigos,
        transportadora_id: Number(value.transportadora_id),
        transportadora_nome: value.transportadora_nome || null,
        data_criacao: value.data_criacao,
      };
      console.log('Payload:', payload);
      this.expeditionService.createRomaneio(payload).subscribe({
        next: async (resp) => {
          await this.showAlert({
            icon: 'success',
            title: 'Romaneio criado com sucesso!',
            text: resp.message,
            confirmButtonText: 'Ok',
          });
          this.activeModal.close('success');
          window.location.reload();
        },
        error: async (err) => {
          await this.showAlert({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível criar o romaneio.',
            confirmButtonText: 'Ok',
          });
          console.error(err);
        },
      });
    }
  }

  toggleTransportadoraInput(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.showTransInput = value === '';
  }

  async showAlert(swalOptions: SweetAlertOptions): Promise<void> {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    await this.noticeSwal.fire();
  }
}
