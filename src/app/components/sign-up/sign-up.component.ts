import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StrongPasswordRegx } from 'src/constants';
import { EmailFormatRegx } from 'src/constants';


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

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.currentUserValue) {
      this.currentUser = this.userService.currentUserValue.userName;
      this.userService.getCurrentId();
      this.currentUserId = this.userService.currentId;
      console.log(this.currentUser);
      console.log(this.currentUserId);
      this.myFormGroup();
    } else (window.alert("In order to create a user for someone else, you must log in."),
      this.router.navigate(['auth/signin']))
  }

  myFormGroup() {
    this.newUserForm = new FormGroup({
      //not required fields to sign up
      firstName: new FormControl(),
      lastName: new FormControl (),
      email: new FormControl (null, [Validators.required, Validators.pattern(EmailFormatRegx)]),
      //required fields to sign up
      userName: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password: new FormControl(null,[Validators.required, Validators.pattern(StrongPasswordRegx)]),
      city: new FormControl(),
      state: new FormControl (),
      country: new FormControl (),
    });
  }

  signUp() {
    if (!this.newUserForm.valid) {
      window.alert('Please provide all the required values!');
    } else {
      this.newUser = this.newUserForm.value;
      this.userService.signUp(this.newUser).subscribe(() => {
        window.alert("User Registered Successfully");
        this.router.navigate(['/auth/signin']);
      }, error => {
        window.alert("User Registration Error");
        console.log('Error: ', error)
      });
    }
  }
}
