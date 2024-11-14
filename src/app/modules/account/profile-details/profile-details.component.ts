import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Cargo, Cidade, UserUpdate, Usuario } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
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
  user: Usuario;
  filteredCidades: Observable<Cidade[]>;
  cargos: Cargo[];
  regioes = REGIOES;
  errorMessage: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private readonly formBuilder: FormBuilder,
    private azzoService: AzzoService,
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
    const loadingSubscr = this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.azzoService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });

    const userSubscr = this.accountService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
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
            finalize(() => (this.isLoading = false)),
          );
        } else {
          this.isLoading = false;
          return of([]);
        }
      }),
    );
  }

  get f() {
    return this.profileForm.controls;
  }

  displayCidade(cidade: Cidade): string {
    return cidade && cidade.nome ? cidade.nome : '';
  }

  userUpdate(): void {
    this.isLoading$.next(true);

    if (!this.profileForm.valid || !this.user) {
      console.warn('O formulário não está válido ou o usuário não está carregado.');
      this.isLoading$.next(false);
      return;
    }

    const updatedFields: Partial<UserUpdate> = {};
    const cidadeValue = this.f.cidade.value;

    // Verifica a cidade antes de atualizar os outros campos
    if (typeof cidadeValue === 'string' && cidadeValue.trim()) {
      // Busca exata pela cidade digitada
      this.accountService.searchCitiesPartial(cidadeValue).subscribe({
        next: (cidades) => {
          const cidadeExata = cidades.find((cidade) => cidade.nome.trim().toLowerCase() === cidadeValue.trim().toLowerCase());

          if (cidadeExata) {
            updatedFields.cidade_id = cidadeExata.cidade_id;
            this.errorMessage = ''; // Limpa a mensagem de erro se uma cidade exata for encontrada
            this.proceedWithUpdate(updatedFields); // Chama a função para continuar com o update
          } else {
            // Exibe mensagem de erro e interrompe o processo
            this.errorMessage = `Cidade "${cidadeValue}" não encontrada.`;
            this.isLoading$.next(false);
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.isLoading$.next(false);
          this.errorMessage = 'Erro ao buscar a cidade.';
          this.cdr.detectChanges();
        },
      });
      return;
    } else if (cidadeValue && cidadeValue.cidade_id) {
      updatedFields.cidade_id = cidadeValue.cidade_id;
    }

    // Se não há erro de cidade, continua com o update
    this.proceedWithUpdate(updatedFields);
  }

  // Função auxiliar para continuar o update após validações
  private proceedWithUpdate(updatedFields: Partial<UserUpdate>): void {
    const fieldsToCheck: { [key in keyof UserUpdate]?: any } = {
      nome: this.f.nome.value,
      email: this.f.email.value,
      celular: this.f.celular.value,
      endereco: this.f.endereco.value,
      nascimento: this.f.nascimento.value,
      cargo_id: this.f.cargo.value !== this.user.cargo.cargo_id ? Number(this.f.cargo.value) : undefined,
      regiao_id: this.f.regiao.value !== this.user.regiao?.regiao_id ? Number(this.f.regiao.value) : undefined,
    };

    Object.keys(fieldsToCheck).forEach((key) => {
      const fieldValue = fieldsToCheck[key as keyof UserUpdate];
      if (fieldValue !== undefined && fieldValue !== this.user[key as keyof Usuario]) {
        updatedFields[key as keyof UserUpdate] = fieldValue;
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      this.isLoading$.next(false);
      console.log('Nenhuma alteração detectada.');
      return;
    }

    this.accountService.updateUserInfo(this.user.usuario_id, updatedFields).subscribe({
      complete: () => {
        this.isLoading$.next(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading$.next(false);
        this.errorMessage = 'Erro ao atualizar o usuário.';
        this.cdr.detectChanges();
      },
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
