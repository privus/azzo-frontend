import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Commissions } from '../models';
import { SellersService } from '../services/sellers.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-goals-modal',
  templateUrl: './goals-modal.component.html',
  styleUrls: ['./goals-modal.component.scss'],
})
export class GoalsModalComponent implements OnInit {
  @Input() vendedores: Commissions[] = [];
  form: FormGroup;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  public currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    allowNegative: false,
    align: 'left',
  };

  constructor(
    private fb: FormBuilder,
    private sellersService: SellersService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      metas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const metasForm = this.form.get('metas') as FormArray;

    this.vendedores.forEach((vendedor) => {
      metasForm.push(
        this.fb.group({
          vendedor_id: [vendedor.vendedor_id],
          nome: [vendedor.vendedor],
          meta_ped: [vendedor.meta_ped || null],
          meta_fat: [vendedor.meta_fat || null],
        }),
      );
    });
  }

  get metas(): FormArray {
    return this.form.get('metas') as FormArray;
  }

  salvarMetas(): void {
    const metas = this.metas.value;

    this.sellersService.saveGoals(metas).subscribe({
      next: async (resp) => {
        console.log('rep ==================>', resp);
        await this.showAlert({
          icon: 'success',
          title: 'Metas criadas com sucesso!',
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
          text: 'Não foi possível criar as metas.',
          confirmButtonText: 'Ok',
        });
        console.error(err);
      },
    });
  }

  async showAlert(swalOptions: SweetAlertOptions): Promise<void> {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    await this.noticeSwal.fire();
  }
}
