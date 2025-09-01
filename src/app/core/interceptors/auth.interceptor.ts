import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiToken = environment.apiBearerToken;

    // Detecta upload (FormData)
    const isFormData = typeof FormData !== 'undefined' && req.body instanceof FormData;

    // Começa pelos headers atuais para não sobrescrever algo já definido no request
    let headers = req.headers;

    // Sempre adiciona Authorization se houver token
    if (apiToken) {
      headers = headers.set('Authorization', `Bearer ${apiToken}`);
    }

    // Só seta Content-Type JSON quando NÃO for FormData e quando ainda não houver Content-Type
    if (!isFormData && !headers.has('Content-Type') && req.method !== 'GET') {
      headers = headers.set('Content-Type', 'application/json');
    }
    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}
