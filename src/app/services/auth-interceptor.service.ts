import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private readonly publicEndpoints = [
    '/auth/signin',
    '/auth/signup',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/validate-reset-token',
    '/auth/reset-password',
    '/auth/verify-recaptcha',

    // public utility endpoints
    '/user/check-username',
    '/user/check-email',
    '/post/search',
    '/project/check-email',
    '/project/check-email-true',
  ];

  constructor(
    private userService: UserService,
    private auth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // ✅ Skip Authorization header for public endpoints
    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }

    const user = this.userService.currentUserValue;

    if (user?.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === 401 &&
          !req.url.includes('/auth/')
        ) {
          this.auth.markSessionExpired();
        }
        return throwError(() => err);
      })
    );
  }

  private isPublicEndpoint(url: string): boolean {
    return this.publicEndpoints.some(endpoint => url.includes(endpoint));
  }
}