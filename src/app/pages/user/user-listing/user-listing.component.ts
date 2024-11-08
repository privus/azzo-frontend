import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Usuario } from '../../../modules/account/models/user.model';
import { AzzoService } from 'src/app/core/services/azzo.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
})
export class UserListingComponent implements OnInit {
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};
  users: Usuario[] = [];
  filteredUsers: Usuario[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: AzzoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      },
    });
  }

  // Implementação do método onSearch
  onSearch(searchText: string): void {
    this.searchQuery = searchText.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.nome.toLowerCase().includes(this.searchQuery) ||
      user.email.toLowerCase().includes(this.searchQuery) ||
      user.celular.toLowerCase().includes(this.searchQuery) ||
      (user.cargo?.nome || '').toLowerCase().includes(this.searchQuery)
    );
  }


  getRandomColor(): string {
    const colors = ['success', 'info', 'warning', 'danger'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  edit(user: Usuario): void {
    // Implemente a funcionalidade de edição conforme necessário
    console.log('Editar usuário:', user);
  }

  delete(user: Usuario): void {
    const confirmOptions: SweetAlertOptions = {
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    };
    this.swalOptions = confirmOptions;
    this.noticeSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(user.usuario_id).subscribe({
          next: () => {
            this.showAlert({
              icon: 'success',
              title: 'Deletado!',
              text: 'O usuário foi deletado.',
            });
            this.loadUsers();
          },
          error: (error) => {
            this.showAlert({
              icon: 'error',
              title: 'Erro!',
              text: 'Ocorreu um erro ao deletar o usuário.',
            });
            console.error('Erro ao deletar usuário:', error);
          },
        });
      }
    });
  }

  showAlert(swalOptions: SweetAlertOptions): void {
    this.swalOptions = swalOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
}
