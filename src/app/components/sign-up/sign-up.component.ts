import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
// import { StrongPasswordRegx } from 'src/app/helpers/constants';
import { EmailFormatRegx } from 'src/app/helpers/constants';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { UserSignUp } from 'src/app/models/user-signup';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  newUser: User = new User();

  newUserForm!: FormGroup;

  currentUser?: string = "";
  currentUserId: number = 0;

  username: string = "";
  usernameError: string = "";
  emailError: string = "";
  email: string = "";
  password: string = "";
  loading = false;
  captcha: string | null = "";
  siteKey: string = MyRecaptchaKey;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.newUserForm = this.formBuilder.group({
      firstName: [""],
      lastName: [""],
      email: [null, [Validators.required, Validators.pattern(EmailFormatRegx)]],
      userName: [null, [Validators.required, Validators.minLength(6)]],
      city: [""],
      state: [""],
      country: ["USA"],
      terms: [false],  // Start with false instead of 0
      privacy: [false], // Start with false instead of 
      role: [0],
      projId_fk: [1] 
    });

  }

  // Helper method to check if the button should be enabled
  isFormValid(): boolean {
    return this.newUserForm.get('terms')?.value && this.newUserForm.get('privacy')?.value;
  }

  

  signUp(event: Event) {
    //prevent the SignIn from bypassing captcha
    if (!this.captcha) {
      event.preventDefault();
      window.alert("You must verify that you're not a robot")
      return;
    } else
      this.loading = true
    if (!this.newUserForm.valid) {
      window.alert('Please provide all the required values!');
      this.loading = false
      if (!this.newUserForm.get('terms')?.value || !this.newUserForm.get('privacy')?.value) {
        window.alert('Please agree to the Terms of Service and Privacy Policy before registering.');
        return;
      }
    } else {
      this.newUser = this.newUserForm.value as UserSignUp;
      console.log("newUserForm.value ", this.newUserForm.value);
      //make sure userName or Email are not already registered.
      this.username = this.newUserForm.value.userName;
      this.email = this.newUserForm.value.email;
      this.checkUserName();
      this.checkEmail();
      if (this.emailError) { window.alert("Try a different email address") };
      
      //Set the projectId to 1, which is the default,
      // until user creates a new one or joins an existing one.
      this.newUser.projId_fk = 1;
    
      // Map `true/false` to `1/0` for `terms` and `privacy`
      const formData = {
        ...this.newUser,
        terms: this.newUserForm.get('terms')?.value ? 1 : 0,
        privacy: this.newUserForm.get('privacy')?.value ? 1 : 0,
      };
      
      this.userService.signUp(formData).subscribe(() => {
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
    
    this.userService.checkUserName(this.username).subscribe(response => {
      console.log(response)
    }, error => {
      window.alert("Username in use. Try a different one.");
      this.loading = false;
      console.log('Error: ', error)
    });
  }

  checkEmail() {
    
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
      this.router.navigate(['/reset-password']);
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
}
