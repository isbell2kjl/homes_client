import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { BehaviorSubject, of} from 'rxjs';
import { map } from 'rxjs/operators';
// import { environment } from 'src/environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  //variables used to modify dropdown menu
  public active$!: Observable<boolean>;
  public currentName: string = "";
  private refreshTokenTimeout?: any;
  private filterKeyword: string = '';

  baseURL: string = 'https://myproperties.ddns.net/api';

  //currently logged in user ideas from:
  //https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //https://stackoverflow.com/questions/60018218/how-can-i-check-and-store-user-id-in-angular-and-localstorage

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.user = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Get current user
  getCurrentUser(): Observable<User> {

    let tokenKey: any = this.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    return this.http.get<User>(`${this.baseURL}/user/current`, {
      headers: reqHeaders,
    });

  }

  //method used to modify dropdown menu.
  getUserActiveState(state: string, username: string): Observable<boolean> {
    if (state === "active") {
      this.currentName = username;
      return of(true);
    }
    else {
      return of(false);
    }
  }

  signUp(newUser: User) {
    return this.http.post(`${this.baseURL}/auth/signup`, newUser);
  }

  signIn(username: string, password: string) {
    return this.http.post<any>(`${this.baseURL}/auth/signin`, { username, password }, { withCredentials: true })
      .pipe(map(user => {
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  refreshToken() {
    return this.http.post<any>(`${this.baseURL}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(map((user) => {
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  Signout() {

    let tokenKey: any = this.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    this.http.post<any>(`${this.baseURL}/auth/revoke-token`, {}, { headers: reqHeaders, withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    this.currentUserSubject.next(null);
}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseURL}/user`);

  }

  getUsersBySearch(searchKeyword: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseURL}/user/search?name=${searchKeyword}`);

  }

  setFilterKeyword(keyword: string) {
    this.filterKeyword = keyword
  }

  getFilterKeyword(): string {
    return this.filterKeyword
  }

  getUserByID(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseURL}/user/${userId}`);
  }

  checkUserName(username: string): Observable<any> {
    return this.http.get(`${this.baseURL}/user/check-username?username=${username}`);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/user/check-email?email=${email}`);
  }

  editUserByID(userId: string, editedUser: User): Observable<User> {
    let tokenKey: any = this.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<User>(`${this.baseURL}/user/${userId}`, editedUser, { headers: reqHeaders });
  }

  deleteUserByID(userId: string): Observable<any>  {
    let tokenKey: any = this.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    this.stopRefreshTokenTimer();
    return this.http.delete<any>(`${this.baseURL}/user/${userId}`,  { headers: reqHeaders })
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseURL}/auth/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post(`${this.baseURL}/auth/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${this.baseURL}/auth/reset-password`, { token, password, confirmPassword });
  }

  private startRefreshTokenTimer() {

    // set a timeout to refresh the token at 4 minutes, which is 1 minute before it expires.
    const expires = new Date(Date.now() + 300000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
  
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

} 