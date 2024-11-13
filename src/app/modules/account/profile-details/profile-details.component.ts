import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Cargo, Cidade, UserUpdate, Usuario } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { REGIOES } from '../../../shared/constants/user-constant';
import { AzzoService } from '../../../core/services/azzo.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  user: Usuario | null = null;
  filteredCidades: Observable<Cidade[]>;
  cargos: Cargo[]
  regioes = REGIOES;
  errorMessage: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private readonly formBuilder: FormBuilder,
    private azzoService: AzzoService
  ) {
    this.profileForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      cidade: [''],
      nascimento: ['', [Validators.required]],
      regiao: [''],
    });
  }

  ngOnInit(): void {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.azzoService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });

    const userSubscr = this.accountService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.profileForm.patchValue({
          nome: this.user.nome,
          cargo: this.user.cargo.nome,
          email: this.user.email,
          celular: this.user.celular,
          endereco: this.user.endereco,
          cidade: this.user.cidade,
          nascimento: this.user.nascimento,
          regiao: this.user.regiao?.regiao_id,
        });
      } else {
        console.error('Usuário não está carregado.');
      }
      console.log('Usuário carregado:', user);
    });
    this.unsubscribe.push(userSubscr);

    this.filteredCidades = this.profileForm.get('cidade')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap((value) => {
        console.log('Value from valueChanges:', value);
        this.isLoading = true;
      }),
      switchMap((value) => {
        if (typeof value === 'string' && value.length >= 2) {
          return this.accountService.searchCitiesPartial(value).pipe(
            tap((cities) => {
              console.log('Cities returned:', cities);
            }),
            finalize(() => (this.isLoading = false))
          );
        } else {
          this.isLoading = false;
          return of([]);
        }
      })
    );
  }

  get f() {
    return this.profileForm.controls;
  }

  displayCidade(cidade: Cidade): string {
    return cidade && cidade.nome ? cidade.nome : '';
  }

  onCidadeSelected(event: MatAutocompleteSelectedEvent): void {
    const cidade: Cidade = event.option.value;
    // Você pode realizar ações adicionais aqui, se necessário
  }

  userUpdate(): void {
    this.isLoading$.next(true);
  
    if (!this.profileForm.valid || !this.user) {
      console.warn('O formulário não está válido ou o usuário não está carregado.');
      this.isLoading$.next(false);
      return;
    }
  
    const updatedFields: Partial<UserUpdate> = {};
    const currentUser = this.user;
  
    // Verifica cada campo e só adiciona ao updatedFields se for diferente
    const fieldsToUpdate: { [key: string]: any } = {
      nome: this.f.nome.value,
      email: this.f.email.value,
      celular: this.f.celular.value,
      endereco: this.f.endereco.value,
      nascimento: this.f.nascimento.value,
      cargo_id: this.f.cargo.value !== currentUser.cargo.cargo_id ? Number(this.f.cargo.value) : null,
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
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao atualizar o usuário:', error);
        this.isLoading$.next(false);
        this.errorMessage = (error as any)?.error?.message || 'Erro no login.';
        this.cdr.detectChanges(); 
      },
    });
  }
  

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
