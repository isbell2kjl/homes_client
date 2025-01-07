import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  emailForm = new FormGroup({
    email: new FormControl(''),
    recaptcha: new FormControl('', Validators.required)
  });

  email: string = "";
  loading = false;
  captcha: string | null = null;
  siteKey: string = MyRecaptchaKey;


  constructor(private userService: UserService, private router: Router, private location: Location) { }

  ngOnInit() { }

  //Modified version of "forgot password feature" from:
  //https://jasonwatmore.com/post/2020/08/29/angular-10-boilerplate-email-sign-up-
  //with-verification-authentication-forgot-password#account-login-component-ts

  onRecaptchaResolved(token: string | null): void {
    if (token) {
      this.emailForm.get('recaptcha')?.setValue(token);
      this.captcha = token;
      // Call the backend or process the token
    } else {
      this.emailForm.get('recaptcha')?.setValue('');  // Clear the value if token is null
      console.warn('reCAPTCHA failed or returned null');
      // Handle the case when token is null (e.g., show an error)
    }
  }


  onSubmit() {
    // Prevent the sign-in process from bypassing the captcha
    if (this.emailForm.valid && this.captcha) {

      this.userService.verifyRecaptcha(this.captcha).subscribe({
        next: (response) => {
          console.log('reCAPTCHA verified successfully', response);


          this.email = this.emailForm.value.email!;
          this.loading = true
          this.userService.forgotPassword(this.email).subscribe(response => {
            console.log(response)
            window.alert("If this account exists, you will receive an email.");
            this.loading = false;
            this.emailForm.reset();
            this.router.navigateByUrl('/reset-password');
          }, error => {
            window.alert("Enter a valid Email address.");
            this.loading = false;
            console.log('Error: ', error)
            if (error.status === 401 || error.status === 403) {
              this.router.navigateByUrl('auth/signin');
            }
          });
        },
        error: (err) => {
          window.alert("Invalid reCAPTCHA.");
          console.error('Invalid reCAPTCHA', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Reset reCAPTCHA if needed
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  }

  back(): void {
    this.location.back()
  }

}
