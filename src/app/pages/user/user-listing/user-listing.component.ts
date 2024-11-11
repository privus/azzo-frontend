import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Usuario } from '../../../modules/account/models/user.model';
import { AzzoService } from 'src/app/core/services/azzo.service';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEditModal } from '../user-edit-modal/user-edit-modal.component';

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
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(
    private azzoService: AzzoService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.azzoService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.cdr.detectChanges();
        this.isLoading$.next(false);

      // Log para verificar os dados dos usuários
      console.log('Usuários carregados ======>', users);
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
    const modalRef = this.modalService.open(UserEditModal);
    modalRef.componentInstance.userModel = { ...user };
    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.loadUsers();
        }
      },
    );
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
    
    // Define as opções e abre o modal de confirmação
    this.swalOptions = confirmOptions;
    this.cdr.detectChanges();
    this.noticeSwal.fire().then((result) => {
      if (result.isConfirmed) {
        // Exclui o usuário apenas se confirmado
        this.azzoService.deleteUser(user.usuario_id).subscribe({
          next: () => {
            this.showAlert({
              icon: 'success',
              title: 'Deletado!',
              text: 'O usuário foi deletado com sucesso.',
            });
            this.loadUsers(); // Recarrega a lista após exclusão
          },
          error: (error) => {
            this.showAlert({
              icon: 'error',
              title: 'Erro!',
              text: 'Ocorreu um erro ao tentar excluir o usuário.',
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
