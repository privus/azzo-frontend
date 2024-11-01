import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLogin } from '../../models/auth.model';
import { Cargo } from 'src/app/modules/account/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hasError = false;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  errorMessage: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,    
    private cdr: ChangeDetectorRef 
    
  ) {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    // // redirect to home if already logged in
    // if (this.authService.getToken()) {
    //   this.router.navigate(['/']);
    // }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  async submit() {
    this.hasError = false;

    const login: AuthLogin = { email: this.f.email.value, senha: this.f.password.value };

    try {
      const cargo: Cargo = await this.authService.login(login);
      console.log('Login bem-sucedido, cargo:', cargo);

      if (cargo && cargo.nome === 'Desenvolvedor') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/crafted/account/overview']);
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      this.hasError = true;
      this.errorMessage = (error as any)?.error?.message || 'Erro no login.';
      this.cdr.detectChanges(); 
    }
  }
}
