import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Token fixo da API - sempre adiciona o header de autorização
    const apiToken = environment.apiBearerToken;

    if (apiToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      return next.handle(authReq);
    }

    // Se não houver token configurado, adiciona apenas o Content-Type
    const reqWithHeaders = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });

    return next.handle(reqWithHeaders);
  }
}
