import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Cargo, Cidade, NewUser, Regiao } from '../models/user.model';
import { debounceTime, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { end } from '@popperjs/core';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
})
export class NewAccountComponent implements OnInit {
  newAccountForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  cargos: Cargo[] = [
    { cargo_id: 1, nome: 'Desenvolvedor' },
    { cargo_id: 2, nome: 'Vendedor' },
    { cargo_id: 3, nome: 'Designer' },
    { cargo_id: 4, nome: 'Gerente' },
    { cargo_id: 5, nome: 'Analista' },
    { cargo_id: 6, nome: 'Estagiário' },
    { cargo_id: 7, nome: 'Auxiliar' },
  ];
  regioes: Regiao[] = [
    { regiao_id: 1, nome: 'Norte' },
    { regiao_id: 2, nome: 'Nordeste' },
    { regiao_id: 3, nome: 'Centro-Oeste' },
    { regiao_id: 4, nome: 'Sudeste' },
    { regiao_id: 5, nome: 'Sul' },
  ];
  filteredCidades: Observable<Cidade[]>;
  cdr: any;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
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
      switchMap((value) =>
        value ? this.accountService.searchCitiesPartial(value) : of([])
      ),
      finalize(() => (this.isLoading = false))
    );
  }

  get f() {
    return this.newAccountForm.controls;
  }

  displayCidade(cidade: Cidade): string {
    return cidade && cidade.nome ? cidade.nome : '';
  }

  onCidadeSelected(event: MatAutocompleteSelectedEvent): void {
    const cidade: Cidade = event.option.value;
    console.log('Cidade selecionada ======>>>>', cidade);
    // Você pode realizar ações adicionais aqui, se necessário
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
      nascimento: this.applyMask(newUser.nascimento, '00/00/0000'),
      celular: this.applyMask(newUser.celular, '(00) 00000-0000'),
      regiao_id: Number(newUser.regiao) || null,
      endereco: newUser.endereco,
    };
    this.accountService.createAccount(formattedUser).subscribe({
      complete: () => {
        this.isLoading = false;
        alert('Usuário criado com sucesso!');
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.error?.message || 'Erro ao criar usuário.'; 
        this.cdr.detectChanges();
      },
    });
  }
  
  applyMask(value: string, mask: string): string {
    // Implement the mask logic here
    // This is a simple example, you might need a more complex implementation
    let maskedValue = '';
    let maskIndex = 0;
    for (let i = 0; i < value.length && maskIndex < mask.length; i++) {
      if (mask[maskIndex] === '0') {
        maskedValue += value[i];
        maskIndex++;
      } else {
        maskedValue += mask[maskIndex];
        maskIndex++;
        i--;
      }
    }
    return maskedValue;
  }
}
