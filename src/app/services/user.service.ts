import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { SignInResponse } from '../models/sign-in-response';
import { BehaviorSubject, EMPTY, of, throwError } from 'rxjs';
import { map, tap, catchError} from 'rxjs/operators';
import { baseURL } from '../helpers/constants';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  //variables used to modify dropdown menu
  public active$!: Observable<boolean>;
  public currentName: string = "";
  private refreshTokenTimeout?: any;
  private isRefreshing = false; // Flag to track refresh status
  private filterKeyword: string = '';
  private currentUserId: number | null = null;
  private currentUserName: string = "";
  private currentProjectId: number = 0;
  currentEmail: string = "";


  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // initializeUser() {
  //   // Check if the page was reloaded
  //   const wasRefreshed = sessionStorage.getItem('wasRefreshed');
  
  //   if (wasRefreshed) {
  //     sessionStorage.removeItem('wasRefreshed'); // Clear flag after running
  //     console.log('Page was refreshed. Fetching current user...');
      
  //     this.getCurrentUser().subscribe(user => {
  //       if (user) {
  //         this.currentUserSubject.next(user); // ✅ Update BehaviorSubject
  //         this.active$ = this.getUserActiveState('active', user.userName);
  //       }
  //     }, error => {
  //       console.log('User not found or session expired.', error);
  //     });
  //   }
  // }

  verifyRecaptcha(token: string): Observable<any> {
    return this.http.post(`${baseURL}/auth/verify-recaptcha`, { Token: token })
      .pipe(
        catchError(error => {
          console.error('Recaptcha verification failed:', error);
          return throwError(() => new Error('Recaptcha verification failed.'));
        })
      );
  }
  

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }


  refreshToken() {
    if (this.isRefreshing) {
      console.warn('Refresh token request already in progress.');
      return EMPTY; // Prevent multiple requests
    }

    this.isRefreshing = true; // Set the flag

    return this.http.post<any>(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(map((user) => {
        this.isRefreshing = false; // Reset the flag
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }),
        catchError(err => {
          this.isRefreshing = false; // Reset the flag even on error
          console.error('Error refreshing token:', err);
          this.signOut();
          return throwError(err);
        })
      );
  }




  private startRefreshTokenTimer() {

    // Clear existing timer
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    // Proceed with setting new timer
    const token = this.getToken();
    if (!token) return;

    // set a timeout to refresh the token at 4 minutes, which is 1 minute before it expires.
    const expires = new Date(Date.now() + 300000);
    //the token timeout in the backend is 5 minutes.
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    console.log('Setting refresh timer with timeout:', timeout);

    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    } else {
      console.warn('Token is already expired or about to expire. Refreshing immediately.');
      this.refreshToken().subscribe();
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }


  getCurrentUser(): Observable<any> {
    let tokenKey: any = this.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    return this.http.get<any>(`${baseURL}/user/current`, { headers: reqHeaders, withCredentials: true }).pipe(
      tap((user: User) => {
        if (user) {
          // this.currentUserSubject.next(user);
          this.currentUserName = user.userName!;
          this.currentEmail = user.email!;
          this.currentUserId = user.userId!;
          this.currentProjectId = user.projId_fk!;

        // Update BehaviorSubject
        if (user.token) {
          this.currentUserSubject.next(user);
          // console.log("After Behaviour Subject update token ", this.getToken());
        }
      }

        return user;

      }),
      catchError((error) => {
        console.error('Error during getCurrentUser:', error);
        return throwError(() => error); // Pass other errors back
      })
    );
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

  getCurrentEmail(): string {
    return this.currentEmail;
  }

  getProjectId(): number {
    return this.currentProjectId;
  }

  getUserId(): number {
    return this.currentUserId!;
  }

  getUserName(): string {
    return this.currentUserName;
  }

  signUp(newUser: any): Observable<void> {
    return this.http.post<void>(`${baseURL}/auth/signup`, newUser);
  }

  signIn(username: string, password: string): Observable<User> {
    return this.http
      .post<SignInResponse>(
        `${baseURL}/auth/signin`,
        { username, password },
        { withCredentials: true } // Required for handling HTTP-only cookies
      )
      .pipe(
        map((response) => {
          // Construct User object from SignInResponse
          const user: User = {
            userId: response.userId,
            userName: response.userName,
            token: response.token, // Map the token explicitly
          };

          // Update BehaviorSubject
          if (user.token) {
            this.currentUserSubject.next(user);
            this.startRefreshTokenTimer();
          }

          return user;
        })
      );
  }

  signOut(): void {
    const tokenKey = this.currentUserValue?.token;
    const reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    };

    // console.log("Sending sign-out request with token:", tokenKey); // Log token to verify

    this.http.post<any>(
      `${baseURL}/auth/revoke-token`,
      {},
      { headers: reqHeaders, withCredentials: true }
    ).subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        this.stopRefreshTokenTimer(); // Clear the token timer
        this.active$ = this.getUserActiveState('', ''); // Reset the menu state
        this.currentUserSubject.next(null); // Clear the current user state
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.stopRefreshTokenTimer(); // Clear the timer on error
        this.active$ = this.getUserActiveState('', ''); // Reset the menu state
        this.currentUserSubject.next(null); // Reset the user state on failure
      }
    });
  }

  getAllUsers(projectId: string): Observable<User[]> {
    const tokenKey = this.currentUserValue?.token;
    const reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    };

    return this.http.get<User[]>(`${baseURL}/user/project/${projectId}`,
      {headers: reqHeaders}
    );

  }

  getAdminUsers(): Observable<User[]> {
    const tokenKey = this.currentUserValue?.token;
    const reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    };

    return this.http.get<User[]>(`${baseURL}/user/admin-users`,
      {headers: reqHeaders}
    );

  }

  getUsersBySearch(searchKeyword: string, projectId: number): Observable<User[]> {
    const tokenKey = this.currentUserValue?.token;
    const reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    };
    return this.http.get<User[]>(`${baseURL}/user/search?name=${searchKeyword}&projectId=${projectId}`,
      {headers: reqHeaders}
    );
  }

  setFilterKeyword(keyword: string) {
    this.filterKeyword = keyword
  }

  getFilterKeyword(): string {
    return this.filterKeyword
  }

  getUserByID(userId: string): Observable<User> {
    let tokenKey: any = this.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<User>(`${baseURL}/user/${userId}`, {headers: reqHeaders});
  }
  
  checkUserName(username: string): Observable<any> {
    return this.http.get(`${baseURL}/user/check-username?username=${username}`);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`${baseURL}/user/check-email?email=${email}`);
  }

  editUserByID(userId: string, editedUser: User): Observable<User> {
    let tokenKey: any = this.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<User>(`${baseURL}/user/${userId}`, editedUser, { headers: reqHeaders });
  }

  deleteUserByID(userId: string): Observable<any> {
    let tokenKey: any = this.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    this.stopRefreshTokenTimer();
    return this.http.delete<any>(`${baseURL}/user/${userId}`, { headers: reqHeaders })
  }

  forgotPassword(email: string) {
    return this.http.post(`${baseURL}/auth/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post(`${baseURL}/auth/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${baseURL}/auth/reset-password`, { token, password, confirmPassword });
  }



} 