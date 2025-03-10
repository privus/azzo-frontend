import { Injectable } from '@angular/core';
import { UserService, SharedService, LoginService } from '../../../core/services';
import { Cidade, NewUser, UserUpdate, Usuario } from '../models/user.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { AuthUser } from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly myInfoKey = 'STORAGE_MY_INFO';
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(
    private readonly userService: UserService,
    private readonly sharedService: SharedService,
    private readonly authService: LoginService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  getUserInfo(): Observable<Usuario | null> {
    // Obtém o item de localStorage como string e parseia para JSON
    const userJson = this.localStorageService.get(this.myInfoKey);

    if (userJson) {
      try {
        // Converte a string JSON para um objeto JavaScript
        const user: AuthUser = JSON.parse(userJson);
        const user$ = this.userService.getUserById(user.userId);
        user$.subscribe((userInfo) => this.userSubject.next(userInfo));
        return user$;
      } catch (error) {
        console.error('Erro ao parsear JSON do usuário:', error);
      }
    }
    // Retorna null caso o item não exista ou o JSON seja inválido
    return of(null);
  }

  updateUserInfo(userId: number, user: UserUpdate): Observable<UserUpdate> {
    const user$ = this.userService.updateUser(userId, user);
    user$.subscribe((userInfo) => {
      const updatedUserInfo = { ...this.userSubject.value, ...userInfo };
      this.userSubject.next(updatedUserInfo);
    });
    return user$;
  }

  searchCities(): Observable<Cidade[]> {
    return this.sharedService.getAllCities().pipe();
  }

  searchCitiesPartial(query: string): Observable<Cidade[]> {
    console.log('searchCitiesPartial called with query:', query);
    return this.sharedService.getCitiesPartial(query).pipe();
  }

  createAccount(user: NewUser): Observable<Usuario> {
    return this.authService.newUser(user).pipe();
  }

  uploadUserPhoto(userId: number, formData: FormData): Observable<{ message: string; fotoUrl: string }> {
    return this.userService.uploadUserPhoto(userId, formData).pipe();
  }
}
