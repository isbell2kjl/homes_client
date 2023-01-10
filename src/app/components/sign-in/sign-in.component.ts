import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignInRequest } from 'src/app/models/sign-in-request';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {


  constructor(private userService: UserService, private router: Router) { }

  userName: string = "";
  password: string = "";
  currentName?: string = "";

  ngOnInit(): void {
  }

  signIn() {
    this.userService.signIn(this.userName, this.password).subscribe((response: any) => {
      window.alert("User logged in Successfully");
      this.router.navigate(['add']);
      //Look up the current user after login.
      this.currentName = this.userService.currentUserValue.userName;
      //method to display the current user name in the menu.
      this.userService.active$ = this.userService.getUserActiveState("active", this.currentName!)
    }, error => {
      window.alert("User login Error");
      console.log('Error: ', error)
    });
  }

}
