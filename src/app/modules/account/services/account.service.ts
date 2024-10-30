import { Injectable } from '@angular/core';
import { AzzoService } from '../../../core/services/azzo.service';
import { Usuario } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { AuthUser } from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
    private readonly myInfoKey = 'STORAGE_MY_INFO';

  constructor(private readonly azzoService: AzzoService, private readonly localStorageService: LocalStorageService) {}

  getUserInfo(): Observable<Usuario | null> {
    // Obtém o item de localStorage como string e parseia para JSON
    const userJson = localStorage.getItem(this.myInfoKey);
    
    if (userJson) {
      try {
        // Converte a string JSON para um objeto JavaScript
        const user: AuthUser = JSON.parse(userJson);
          return this.azzoService.getUserById(user.userId);

      } catch (error) {
        console.error('Erro ao parsear JSON do usuário:', error);
      }
    }  
    // Retorna null caso o item não exista ou o JSON seja inválido
    return of(null);
  }
  
}