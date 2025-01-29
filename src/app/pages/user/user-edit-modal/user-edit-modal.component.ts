import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../../core/services/';
import { Cidade, UserUpdate, Usuario, Cargo } from '../../../modules/account/models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccountService } from '../../../modules/account/services/account.service';
import { REGIOES } from '../../../shared/constants/user-constant';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModal implements OnInit, AfterViewInit, OnDestroy {
  @Input() userModel!: Usuario;
  profileForm!: FormGroup;
  cargos: Cargo[];
  regioes = REGIOES;
  errorMessage: string;
  selectedCidade: Cidade | null = null;

  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private roleService: RoleService,
    private accountService: AccountService,
    public activeModal: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
  ) {
    this.profileForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      cargo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      cidade: ['', [Validators.required], [this.cidadeValidator.bind(this)]],
      nascimento: ['', [Validators.required]],
      regiao: [''],
    });
  }

  ngOnInit(): void {
    this.roleService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });

    if (this.userModel) {
      this.profileForm.patchValue({
        nome: this.userModel.nome,
        cargo: this.userModel.cargo?.cargo_id || '',
        email: this.userModel.email,
        celular: this.userModel.celular,
        endereco: this.userModel.endereco,
        cidade: this.userModel.cidade?.nome || '',
        nascimento: this.userModel.nascimento,
        regiao: this.userModel.regiao?.regiao_id,
      });
      this.selectedCidade = this.userModel.cidade || null;
    }
  }

  ngAfterViewInit(): void {}

  cidadeValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const cidadeValue = control.value;
    if (cidadeValue && typeof cidadeValue === 'string') {
      return this.accountService.searchCitiesPartial(cidadeValue).pipe(
        map((cidades) => {
          const cidadeExata = cidades.find((cidade) => cidade.nome.trim().toLowerCase() === cidadeValue.trim().toLowerCase());
          if (cidadeExata) {
            this.selectedCidade = cidadeExata;
            return null; // Validação bem-sucedida
          } else {
            this.selectedCidade = null;
            return { cidadeNaoEncontrada: true }; // Retorna um erro
          }
        }),
        catchError((err) => {
          console.error('Erro ao buscar cidades:', err);
          this.selectedCidade = null;
          return of({ cidadeNaoEncontrada: true }); // Retorna um erro em caso de falha na API
        }),
      );
    } else {
      this.selectedCidade = null;
      return of({ required: true }); // Retorna um erro se o campo estiver vazio
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    const updatedUser: UserUpdate = {
      nome: this.f.nome.value,
      email: this.f.email.value,
      celular: this.f.celular.value,
      endereco: this.f.endereco.value,
      nascimento: this.f.nascimento.value,
      cargo_id: this.f.cargo.value ? Number(this.f.cargo.value) : null,
      cidade_id: this.selectedCidade?.cidade_id || null,
      regiao_id: this.f.regiao.value ? Number(this.f.regiao.value) : null,
    };

    this.sendUpdateRequest(updatedUser);
  }

  private sendUpdateRequest(updatedUser: UserUpdate): void {
    this.accountService.updateUserInfo(this.userModel.usuario_id, updatedUser).subscribe({
      complete: () => {
        this.showAlert({
          icon: 'success',
          title: 'Usuário atualizado!',
          text: 'O usuário foi atualizado com sucesso.',
          confirmButtonText: 'Ok',
        });
      },
      error: (err) => {
        this.errorMessage = 'Erro ao atualizar o usuário.';
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o usuário.',
          confirmButtonText: 'Ok',
        });
        console.error(err);
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then(() => {
      this.activeModal.close('updated');
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  ngOnDestroy(): void {}
}
