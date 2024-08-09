import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {


  userName: string = "";
  password: string = "";
  currentName?: string = "";

  constructor(private userService: UserService, private router: Router) { }


  ngOnInit(): void {
  }

  signIn() {
    this.userService.signIn(this.userName, this.password).subscribe((response: any) => {
      // window.alert("User logged in Successfully");
      this.router.navigate(['active']);
      //Look up the current user after login.
      this.currentName = this.userService.currentUserValue.userName;
      //method to display the current user name in the menu.
      this.userService.active$ = this.userService.getUserActiveState("active", this.currentName!)
    }, error => {
      window.alert("Username or password are incorrect. \n (Note: Username and Email may be different)");
      console.log('Error: ', error)
    });
  }

}
