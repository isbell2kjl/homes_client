import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navigation-page',
  templateUrl: './navigation-page.component.html',
  styleUrls: ['./navigation-page.component.css']
})
export class NavigationPageComponent {


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  currentUser?: string = "";

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.CheckCurrentUser();
  }

  CheckCurrentUser() {
    //in case the page gets manually refreshed, this will maintain the current username in the menu.
    if (this.userService.currentUserValue) {
      this.currentUser = this.userService.currentUserValue.userName
      if (this.currentUser) {
        // Public boolean observable used to modify dropdown menu.
        this.userService.active$ = this.userService.getUserActiveState(
          'active',
          this.currentUser
        );
        console.log('Current User (from App Component): ', this.currentUser);
      } else {
        console.log('No active user signed in.');
      }
    }
  }

  get isActive(): Observable<boolean> {
    return this.userService.active$
  }

  get currentName(): string {
    return this.userService.currentName
  }

  logout() {
    this.userService.logout();
    //this removes the current username and resets the menu
    this.userService.active$ = this.userService.getUserActiveState('', '');
    this.router.navigate(['auth/signin'])
  }

}

