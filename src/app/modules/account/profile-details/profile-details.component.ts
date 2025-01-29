import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Cargo, Cidade, UserUpdate, Usuario } from '../models/user.model';
import { AccountService } from '../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { REGIOES } from '../../../shared/constants/user-constant';
import { RoleService } from '../../../core/services/';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

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
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  selectedFile: File | null;

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private readonly formBuilder: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
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
    this.accountService.getUserInfo();

    const loadingSubscr = this.isLoading$.asObservable().subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.roleService.getRoles().subscribe((cargos) => {
      this.cargos = cargos;
    });

    this.user = this.route.parent?.snapshot.data['user'];
    if (this.user) {
      this.profileForm.patchValue({
        nome: this.user.nome,
        cargo: this.user.cargo?.nome || '',
        email: this.user.email,
        celular: this.user.celular,
        endereco: this.user.endereco,
        cidade: this.user.cidade,
        nascimento: this.user.nascimento,
        regiao: this.user.regiao?.regiao_id,
      });
    }

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

    // Monta o objeto completo com os valores do formulário
    const cidadeValue = this.f.cidade.value;
    const updatedUser: UserUpdate = {
      nome: this.f.nome.value,
      email: this.f.email.value,
      celular: this.f.celular.value,
      endereco: this.f.endereco.value,
      nascimento: this.f.nascimento.value,
      cargo_id: this.f.cargo.value.length > 2 ? this.user.cargo?.cargo_id : Number(this.f.cargo.value),
      cidade_id: typeof cidadeValue === 'string' ? null : cidadeValue?.cidade_id,
      regiao_id: this.f.regiao.value ? Number(this.f.regiao.value) : null,
    };

    // Envia a requisição diretamente
    this.sendUpdateRequest(updatedUser);
  }
  private sendUpdateRequest(updatedUser: UserUpdate): void {
    this.accountService.updateUserInfo(this.user.usuario_id, updatedUser).subscribe({
      complete: () => {
        this.isLoading$.next(false);
        this.showAlert({
          icon: 'success',
          title: 'Usuário atualizado!',
          text: 'O usuário foi atualizado com sucesso.',
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading$.next(false);
        this.errorMessage = 'Erro ao atualizar o usuário.';
        this.showAlert({
          icon: 'error',
          title: 'Erro!',
          text: 'Não foi possível atualizar o usuário.',
          confirmButtonText: 'Ok',
        });
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validar tamanho (por exemplo, máximo de 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showAlert({
          icon: 'warning',
          title: 'Arquivo muito grande!',
          text: 'O arquivo deve ter no máximo 2MB.',
          confirmButtonText: 'Ok',
        });
        return;
      }

      // Validar tipo de arquivo
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        this.showAlert({
          icon: 'warning',
          title: 'Tipo de arquivo inválido!',
          text: 'Apenas imagens JPG e PNG são permitidas.',
          confirmButtonText: 'Ok',
        });
        return;
      }

      this.selectedFile = file;

      // Atualizar a pré-visualização imediatamente (opcional)
      const reader = new FileReader();
      reader.onload = () => {
        this.user.fotoUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile || !this.user) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.isLoading$.next(true);

    this.accountService
      .uploadUserPhoto(this.user.usuario_id, formData)
      .pipe(
        finalize(() => {
          this.isLoading$.next(false);
          this.selectedFile = null; // Limpar o arquivo selecionado
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('Upload bem-sucedido:', response);
          // Atualizar o usuário com o novo fotoUrl
          this.user.fotoUrl = response.fotoUrl;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao fazer upload da foto:', err);
          this.showAlert({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível atualizar a foto.',
            confirmButtonText: 'Ok',
          });
        },
      });
  }
}
