import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionExpiredSubject = new BehaviorSubject<boolean>(false);
  sessionExpired$ = this.sessionExpiredSubject.asObservable();

  markSessionExpired() {
    if (!this.sessionExpiredSubject.value) {
      this.sessionExpiredSubject.next(true);
    }
  }

  clearSessionExpired() {
    this.sessionExpiredSubject.next(false);
  }
}
