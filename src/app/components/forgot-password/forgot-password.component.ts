import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string = "";
  loading = false;
  captcha: string | null = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {}

  //Modified version of "forgot password feature" from:
  //https://jasonwatmore.com/post/2020/08/29/angular-10-boilerplate-email-sign-up-
  //with-verification-authentication-forgot-password#account-login-component-ts

  onSubmit() {
      this.loading = true
      this.userService.forgotPassword(this.email).subscribe(response => {
        console.log(response)
        window.alert("If this account exists, you will receive an email with a password reset link");
        this.loading = false;
        this.email = "";
      }, error => {
        window.alert("Enter a valid Email address.");
        this.loading = false;
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          this.router.navigateByUrl('auth/signin');
        }
      });

  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

}
