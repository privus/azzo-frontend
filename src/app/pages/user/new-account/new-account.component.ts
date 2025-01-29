import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AccountService } from '../../../modules/account/services/account.service';
import { Cargo, Cidade, NewUser } from '../../../modules/account/models/user.model';
import { debounceTime, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { REGIOES } from '../../../shared/constants/user-constant';
import { RoleService } from '../../../core/services';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
})
export class NewAccountComponent implements OnInit {
  newAccountForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  cargos: Cargo[];
  regioes = REGIOES;
  filteredCidades: Observable<Cidade[]>;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef, // Injetando ChangeDetectorRef corretamente
    private roleService: RoleService,
  ) {
    this.newAccountForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cargo: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      celular: ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      nascimento: ['', Validators.required],
      regiao: [''],
    });
  }

  ngOnInit(): void {
    this.filteredCidades = this.newAccountForm.get('cidade')!.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => (value ? this.accountService.searchCitiesPartial(value) : of([]))),
      finalize(() => (this.isLoading = false)),
    );
    this.roleService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });
  }

  get f() {
    return this.newAccountForm.controls;
  }

  displayCidade(cidade: Cidade): string {
    return cidade && cidade.nome ? cidade.nome : '';
  }

  onCidadeSelected(event: MatAutocompleteSelectedEvent): void {
    const cidade: Cidade = event.option.value;
    console.log('Cidade selecionada:', cidade);
  }

  onSubmit(): void {
    this.isLoading = true;
    const newUser = this.newAccountForm.value;
    const formattedUser: NewUser = {
      nome: newUser.nome,
      username: newUser.username,
      email: newUser.email,
      senha: newUser.senha,
      cidade_id: newUser.cidade.cidade_id,
      cargo_id: Number(newUser.cargo),
      nascimento: newUser.nascimento.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3'),
      celular: newUser.celular.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'),
      regiao_id: Number(newUser.regiao) || null,
      endereco: newUser.endereco,
    };

    console.log('Usuário formatado:', formattedUser);
    this.accountService.createAccount(formattedUser).subscribe({
      complete: () => {
        this.isLoading = false;
        this.showAlert({
          icon: 'success',
          title: 'Usuário criado!',
          text: 'O usuário foi criado com sucesso.',
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
        this.newAccountForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível criar o usuário.',
          confirmButtonText: 'Ok',
        });
        this.errorMessage = err.error?.message || 'Erro ao criar o usuário.';
        this.cdr.detectChanges();
        console.error('Erro ao criar o usuário:', err);
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
