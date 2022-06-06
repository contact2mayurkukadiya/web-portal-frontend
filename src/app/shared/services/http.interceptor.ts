import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const customReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem("access_token")}`)
    });

    return next.handle(customReq);
  }
}
