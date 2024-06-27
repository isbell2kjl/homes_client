import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SignInRequest } from 'src/app/models/sign-in-request';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  //When page loads, set the focus to the input field.  See this solution:
  //https://davidmcintosh.medium.com/auto-focusing-an-angular-input-the-easy-way-part-1-dcb1799e025f

  @ViewChild("myinput") myInputField!: ElementRef;


  constructor(private userService: UserService, private router: Router) { }

  userName: string = "";
  password: string = "";
  currentName?: string = "";

  ngOnInit(): void {
  }

  //When page loads, set the focus to the input field. (See Above)
  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
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
