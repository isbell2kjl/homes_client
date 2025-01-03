//This service is currently not active.  Each endpoint is configured seperately at this time.
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable} from 'rxjs'; 
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const excludedUrls = [
      `${baseURL}/auth/refresh-token`,
      `${baseURL}/auth/signin`,
      `${baseURL}/auth/signup`,
      `${baseURL}/auth/forgot-password`,
      `${baseURL}/auth/validate-reset-token`,
      `${baseURL}/auth/reset-password`,
      `${baseURL}/user/pending-requests`,
    ];

    console.log('Intercepted URL:', request.url);
    console.log('Is Excluded:', excludedUrls);

    if (excludedUrls.some(url => request.url.includes(url))) {
      return next.handle(request); // Don't add Authorization for public endpoints
      
    }

    // Clone the request and add the Authorization header if a token is available
    let authrequest = request;
    const user = this.userService.currentUserValue;
    console.log('token in interceptor: ', user?.token);

    const isLoggedIn = user && user.token;
    // const token = this.userService.currentUserValue?.token;

    if (isLoggedIn) {
      authrequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // console.log('Authorization Header Added:', authrequest.headers.get('Authorization'));
    }
    return next.handle(request);
  }
}