import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm = new FormGroup({
    email: new FormControl(''),
  });

  email: string = "";
  loading = false;
  captcha: string | null = "";
  siteKey: string = MyRecaptchaKey;


  constructor(private userService: UserService, private router: Router, private location: Location) { }

  ngOnInit() { }

  //Modified version of "forgot password feature" from:
  //https://jasonwatmore.com/post/2020/08/29/angular-10-boilerplate-email-sign-up-
  //with-verification-authentication-forgot-password#account-login-component-ts

  onSubmit(event: Event) {
    //prevent the SignIn from bypassing captcha
    if (!this.captcha) {
      event.preventDefault();
      window.alert("You must verify that you're not a robot")
      return;
    } else
      this.email = this.emailForm.value.email!;
      this.loading = true
      this.userService.forgotPassword(this.email).subscribe(response => {
      console.log(response)
      window.alert("If this account exists, you will receive an email witha token.");
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

  back(): void {
    this.location.back()
  }

}
