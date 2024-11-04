import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { FormGroup, FormControl } from '@angular/forms';

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
  currentName?: string = "";
  captcha: string | null = "";
  siteKey: string = MyRecaptchaKey;

  constructor(private userService: UserService, private router: Router) { }


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
      // window.alert("User logged in Successfully");
      this.router.navigate(['active']);
      //Look up the current user after login.
      this.currentName = this.myUserName;
      //method to display the current user name in the menu.
      this.userService.active$ = this.userService.getUserActiveState("active", this.currentName!)
    }, error => {
      window.alert("Username or password are incorrect.");
      console.log('Error: ', error)
      if (error.status === 429 || error.status === 503) {
        window.alert("Too many failed attempts. Wait a few minutes and try again.");
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

}
