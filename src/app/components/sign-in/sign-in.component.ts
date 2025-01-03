import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signinForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  myUserName: string = "";
  myPassword: string = "";
  currentProjectId: number = 0;
  currentUserRole: number = 0;
  currentUserId: number = 0;
  hasPendingRequests: number = 0;
  hasUserRequests: number = 0;
  currentName?: string = "";
  captcha: string | null = "";
  siteKey: string = MyRecaptchaKey;
  currentUser: any;

  constructor(private userService: UserService, private projectService: ProjectService, private router: Router,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
  }

  signIn(event: Event) {
    //prevent the SignIn from bypassing captcha
    if (!this.captcha) {
      event.preventDefault();
      window.alert("You must verify that you're not a robot")
      return;
    } else
      this.myUserName = this.signinForm.value.username!;
    this.myPassword = this.signinForm.value.password!;
    this.userService.signIn(this.myUserName, this.myPassword).subscribe(() => {
      
      console.log("Successful signin")
      
      //Look up the current user after login.
      this.currentName = this.myUserName;

      //method to display the current user name in the menu.
      this.userService.active$ = this.userService.getUserActiveState("active", this.currentName!)
      this.getCurrentUser();

    }, error => {
      window.alert("Username or password are incorrect.");
      console.log('Error: ', error)
      if (error.status === 429 || error.status === 503) {
        window.alert("Too many failed attempts. Wait a few minutes and try again.");
      }
    });
  }


  getCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Fetched user:', user); // Debug output
        this.currentUserId = user.userId;
        this.currentProjectId = user.projId_fk;
        this.currentUserRole = user.role;
  
        if (this.currentProjectId === 1) {
          console.log("project Id ", this.currentProjectId);
          // Check if this user already has a pending request
          this.projectService.getUserRequests(this.currentUserId).subscribe({
            next: (response) => {
              if (response.hasUserRequests) {
                this.snackBar.open(
                  'You have a pending request. Wait for admin approval.',
                  'Close',
                  { duration: 5000, verticalPosition: 'top' }
                );
                // this.logout();
                this.router.navigate(['join-request']);
              } else {
                // If no pending requests, proceed to the join-request screen.
                this.snackBar.open('Join or create a user group', 'Close', { duration: 5000, verticalPosition: 'top' });
                this.router.navigate(['join-request']);
              }
            },
            error: (err) => {
              console.error('Error fetching user requests', err);
              this.snackBar.open('Failed to check requests. Try again.', 'Close', { duration: 5000, verticalPosition: 'top' });
            }
          });
        } else if (this.currentUserRole === 1) { // If user is an admin
          // Check for pending requests to address.
          this.projectService.getPendingRequests(this.currentProjectId).subscribe({
            next: (response) => {
              if (response.hasPendingRequests) {
                this.snackBar.open('Please review your pending join requests', 'Close', { duration: 5000, verticalPosition: 'top' });
                this.router.navigate(['admin-dashboard']);
              } else {
                this.router.navigate(['active']);
              }
            },
            error: (err) => {
              console.error('Error fetching pending requests', err);
              this.snackBar.open('Failed to check pending requests.', 'Close', { duration: 5000, verticalPosition: 'top'});
            }
          });
        } else {
          this.router.navigate(['active']);
        }
      },
      error: (error) => {
        console.log('Error: ', error);
        if (error.status === 401 || error.status === 403) {
          window.alert("Access timeout, you must log in again.");
          // This signs the user out and removes the username from the Menu
          this.userService.signOut();
          this.router.navigate(['auth/signin']);
        }
      }
    });
  }
  


  logout() {
    this.userService.signOut();
    this.router.navigate(['auth/signin'])
    // });
  }

  //when user checks "I'm not a robot"
  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

  //prevent the ENTER key from bypassing captcha
  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!this.captcha) {
      keyboardEvent.preventDefault();
      window.alert("You must verify that you're not a robot")
      return;
    }
  }

}
