import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentId: number = 0;
  //variables used to modify dropdown menu
  public active$!: Observable<boolean>;
  public currentName: string = "";


  // authBaseURL: string = "https://localhost:7279/api/auth";
  authBaseURL: string = "https://myproperties.ddns.net/api/auth"
  // authBaseURL: string = "https://raspberrypi4.wlan/api/auth";
  // userBaseURL: string = "https://localhost:7279/api/user";
  userBaseURL: string = "https://myproperties.ddns.net/api/user"
  // userBaseURL: string = "https://raspberrypi4.wlan/api/user";

  //currently logged in user ideas from:
  //https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //https://stackoverflow.com/questions/60018218/how-can-i-check-and-store-user-id-in-angular-and-localstorage

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getCurrentId():  number{
    // Get the current user ID.
   return this.currentId = JSON.parse(localStorage.getItem('currentUser') as string).id | 0;
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
    return this.http.post(`${this.authBaseURL}/signup`, newUser);
  }

  signIn(username: string, password: string) {
    return this.http.post<any>(`${this.authBaseURL}/signin`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.getCurrentId();
        return user;
      }));
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next;
    // this.currentUserSubject.unsubscribe;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userBaseURL);

  }

  getUsersBySearch(searchKeyword: string): Observable<User[]> {
    return this.http.get<User[]>(this.userBaseURL + "/search?name=" + searchKeyword);

  }

  getUserByID(userId: string): Observable<User> {
    return this.http.get<User>(this.userBaseURL + "/" + userId);
  }

  editUserByID(userId: string, editedUser: User): Observable<User> {
    let tokenKey: any = this.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<User>(this.userBaseURL + "/" + userId, editedUser, { headers: reqHeaders });
  }

}