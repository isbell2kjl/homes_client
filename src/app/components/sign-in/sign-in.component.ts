import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
declare var grecaptcha: any; // This tells TypeScript that "grecaptcha" exists globally.


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {

  passwordVisible = false;
  hideTimeout: any;
  captcha: string | null = null;
  siteKey: string = MyRecaptchaKey;


  signinForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    recaptcha: new FormControl('', Validators.required)
  });

  myUserName: string = "";
  myPassword: string = "";
  currentProjectId: number = 0;
  currentUserRole: number = 0;
  currentUserId: number = 0;
  hasPendingRequests: number = 0;
  hasUserRequests: number = 0;
  currentName?: string = "";
  currentUser: any;
  loading = false;

  constructor(private userService: UserService, private projectService: ProjectService, private router: Router,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
  }



  onRecaptchaResolved(token: string | null): void {
    if (token) {
      this.signinForm.get('recaptcha')?.setValue(token);
      this.captcha = token;
      // Call the backend or process the token
    } else {
      this.signinForm.get('recaptcha')?.setValue('');  // Clear the value if token is null
      console.warn('reCAPTCHA failed or returned null');
      // Handle the case when token is null (e.g., show an error)
    }
  }

  handleRecaptchaExpired() {
    this.resetRecaptcha("reCAPTCHA expired");
  }

  resetRecaptcha(reason: string = "Unknown reason") {
    this.captcha = null; // Reset the stored token

    if (typeof grecaptcha !== "undefined" && grecaptcha.reset) {
      grecaptcha.reset();
      console.log(`reCAPTCHA reset due to: ${reason}`);
    } else {
      console.error("grecaptcha is not available, cannot reset reCAPTCHA.");
    }
  }




  signIn(): void {
    // Prevent the sign-in process from bypassing the captcha
    if (this.signinForm.valid && this.captcha) {
      this.loading = true;

      this.userService.verifyRecaptcha(this.captcha).subscribe({
        next: (response) => {
          console.log('reCAPTCHA verified successfully', response);

          this.myUserName = this.signinForm.value.username!;
          this.myPassword = this.signinForm.value.password!;

          this.userService.signIn(this.myUserName, this.myPassword).subscribe({
            next: () => {
              console.log("Successful sign-in");
              this.loading = false;

              // Look up the current user after login
              this.currentName = this.myUserName;


              this.getCurrentUser();
            },
            error: (error) => {
              window.alert("Username or password are incorrect.");
              console.log('Error: ', error);
              this.loading = false;

              if (error.status === 429 || error.status === 503) {
                window.alert("Too many failed attempts. Wait a few minutes and try again.");
              }
              // Reset the reCAPTCHA after a failed attempt
              this.resetRecaptcha("reCAPTCHA reset, failed signin");
            }
          });
        },
        error: (err) => {
          window.alert("Invalid reCAPTCHA. Try again");
          console.error('Invalid reCAPTCHA', err);
          // Reset the reCAPTCHA after a failed attempt
          this.resetRecaptcha("reCAPTCHA reset");
          this.loading = false;
        }
      });
    }
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // console.log('Fetched user:', user);
        this.currentUserId = user.userId;
        this.currentProjectId = user.projId_fk;
        this.currentUserRole = user.role;
        // Method to display the current user name in the menu
        this.userService.active$ = this.userService.getUserActiveState("active", this.currentName!);

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
                this.logout();
                // Reset the reCAPTCHA after a failed attempt
                this.resetRecaptcha("pending request, resetting reCAPTCHA");
                return;
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
              this.snackBar.open('Failed to check pending requests.', 'Close', { duration: 5000, verticalPosition: 'top' });
              this.resetRecaptcha("error fetching pending, resetting reCAPTCHA");
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
          this.resetRecaptcha("Access timeout, resetting reCAPTCHA");
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
    this.resetRecaptcha("manual sign out, resetting reCAPTCHA");
    // });
  }

  ngOnDestroy(): void {
    // Reset reCAPTCHA if needed
    this.resetRecaptcha("Component destroyed, resetting reCAPTCHA");
  }
}
