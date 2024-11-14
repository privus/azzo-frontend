import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AuthLogin } from '../models/auth.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AzzoService } from '../../../core/services/azzo.service';
import { decodeJwt } from '../../../shared/utils/decodeJwt';
import { Cargo } from '../../account/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'STORAGE_TOKEN';
  private readonly myInfoKey = 'STORAGE_MY_INFO';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly azzoService: AzzoService,
  ) {}

  async login(data: AuthLogin): Promise<Cargo> {
    try {
      this.localStorageService.remove(this.tokenKey);

      const tokens = await firstValueFrom(this.azzoService.login(data));

      // Armazena o token no localStorage
      this.localStorageService.set(this.tokenKey, tokens.accessToken);
      this.authStatus.next(true); // Atualiza o estado de autenticação

      // Decodifica o token para obter o cargo
      const decodedToken = decodeJwt(tokens.accessToken);
      this.localStorageService.set(this.myInfoKey, decodedToken);

      return decodedToken.cargo;
    } catch (error) {
      console.error('Erro durante o login:', error);
      this.logOut();
      throw error;
    }
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logOut(): void {
    this.localStorageService.remove(this.tokenKey);
    this.authStatus.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
}
