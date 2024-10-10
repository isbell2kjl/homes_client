import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
// import { StrongPasswordRegx } from 'src/app/helpers/constants';
import { EmailFormatRegx } from 'src/app/helpers/constants';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  newUser: User = new User();

  newUserForm!: UntypedFormGroup;

  currentUser?: string = "";
  currentUserId: number = 0;

  username: string = "";
  usernameError: string = "";
  emailError: string = "";
  email: string = "";
  password: string = "";
  loading = false;
  captcha: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

    this.myFormGroup();

  }

  myFormGroup() {
    this.newUserForm = new UntypedFormGroup({
      //not required fields to sign up
      firstName: new UntypedFormControl(),
      lastName: new UntypedFormControl(),
      email: new UntypedFormControl(null, [Validators.required, Validators.pattern(EmailFormatRegx)]),
      //required fields to sign up
      userName: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      // password: new FormControl(null, [Validators.required, Validators.pattern(StrongPasswordRegx)]),
      // city: new FormControl(),
      // state: new FormControl(),
      // country: new FormControl(),
    });
  }

  signUp() {
    this.loading = true
    if (!this.newUserForm.valid) {
      window.alert('Please provide all the required values!');
      this.loading = false
    } else {
      this.newUser = this.newUserForm.value;
      this.checkUserName();
      this.checkEmail();
      if(this.emailError) {window.alert("Try a different email address")};
      this.newUser.password = this.randomString(10);
      this.userService.signUp(this.newUser).subscribe(() => {
        this.confirmEmail();
        window.alert("User Registered Successfully");
      }, error => {
        window.alert("User Registration Error");
        this.loading = false
        console.log('Error: ', error)
      });
    }
  }

  checkUserName() {
    this.username = this.newUser.userName!;
    this.userService.checkUserName(this.username).subscribe(response => {
      console.log(response)
    }, error => {
      window.alert("Username in use. Try a different one.");
      this.loading = false;
      console.log('Error: ', error)
    });
  }

  checkEmail() {
    this.email = this.newUser.email!;
    this.userService.checkEmail(this.email).subscribe(response => {
      console.log(response)
    }, error => {
      window.alert("Email address in use. Try a different one.");
      this.loading = false;
      console.log('Error: ', error)
    });
  }

  confirmEmail() {
    this.userService.forgotPassword(this.email).subscribe(response => {
      console.log(response)
      window.alert("Check your email to confirm your account");
      this.newUserForm.reset();
      this.email = "";
      this.loading = false;
      this.router.navigate(['/auth/signin']);
    }, error => {
      window.alert("Enter a valid Email address.");
      this.loading = false;
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        this.router.navigateByUrl('auth/signin');
      }
    });
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
  }

  randomString(length: number) {

    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var result = '';

    for (var i = 0; i < length; i++) {

      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));

    }

    return result;

  }
}
