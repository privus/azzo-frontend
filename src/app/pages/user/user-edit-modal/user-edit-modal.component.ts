import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AzzoService } from '../../../core/services/azzo.service';
import { Cidade, UserUpdate, Usuario, Cargo } from '../../../modules/account/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { REGIOES } from '../../../shared/constants/user-constant';
import { AccountService } from '../../../modules/account/services/account.service';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModal implements OnInit, AfterViewInit, OnDestroy {
  @Input() userModel!: Usuario;
  profileForm!: FormGroup;
  filteredCidades: Observable<Cidade[]>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  cargos: Cargo[];
  regioes = REGIOES;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  constructor(
    private azzoService: AzzoService,
    private cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      cargo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      cidade: [''],
      nascimento: ['', [Validators.required]],
      regiao: [''],
    });

    if (this.userModel) {
      this.profileForm.patchValue({
        nome: this.userModel.nome,
        cargo: this.userModel.cargo?.cargo_id || null,
        email: this.userModel.email,
        celular: this.userModel.celular,
        endereco: this.userModel.endereco,
        cidade: this.userModel.cidade,
        nascimento: this.userModel.nascimento,
        regiao: this.userModel.regiao?.regiao_id,
      });
    }
    this.azzoService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });
  }

  ngAfterViewInit(): void {}

  onSubmit() {
    console.log('PROFILE FORM ===>', this.profileForm);

    this.isLoading$.next(true);

    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Sucesso!',
      text: 'Usuário Atualizado Com Sucesso!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Erro!',
      text: 'Erro Ao Atualizar Usuário!',
    };

    const updatedFields: Partial<UserUpdate> = {};
    const currentUser = this.userModel;

    // Verifica cada campo e só adiciona ao updatedFields se for diferente
    const fieldsToUpdate: { [key: string]: any } = {
      nome: this.f.nome.value,
      email: this.f.email.value,
      celular: this.f.celular.value,
      endereco: this.f.endereco.value,
      nascimento: this.f.nascimento.value,
      cargo_id: currentUser.cargo && this.f.cargo.value !== currentUser.cargo.cargo_id ? Number(this.f.cargo.value) : null,
      cidade_id: this.f.cidade.value !== currentUser.cidade?.cidade_id ? this.f.cidade.value.cidade_id : null,
      regiao_id: this.f.regiao.value && this.f.regiao.value !== currentUser.regiao?.regiao_id ? this.f.regiao.value.regiao_id : null,
    };

    // Preenche updatedFields apenas com os valores que foram alterados
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] !== null && fieldsToUpdate[key] !== currentUser[key as keyof Usuario]) {
        updatedFields[key as keyof UserUpdate] = fieldsToUpdate[key];
      }
    });

    this.accountService.updateUserInfo(currentUser.usuario_id, updatedFields).subscribe({
      complete: () => {
        this.showAlert(successAlert);
        this.reloadEvent.emit(true);
      },
      error: (error) => {
        console.error('Erro ao atualizar o usuário:', error);
        this.showAlert(errorAlert);
        this.isLoading$.next(false);
      },
    });
  }

  displayCidade(cidade: Cidade): string {
    return cidade && cidade.nome ? cidade.nome : '';
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then(() => {
      this.activeModal.close('updated'); // Fecha o modal após o alerta de sucesso
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  ngOnDestroy(): void {}
}
