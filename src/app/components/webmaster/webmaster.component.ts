import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-webmaster',
  templateUrl: './webmaster.component.html',
  styleUrls: ['./webmaster.component.css']
})
export class WebmasterComponent implements OnInit {



  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  loading = false;
  captcha: string | null = "";

  constructor(private contactService: ContactService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {
      console.log("User logged in")

    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']))

  }

  onSubmit() {
    this.loading = true
    this.contactService.sendWebMaster(this.name, this.email, this.phone, this.message).subscribe(response => {
      console.log(response)
      window.alert("Thanks for your request. I'll get back to you as soon as possible");
      this.loading = false
      this.name = "";
      this.email = "";
      this.phone = "";
      this.message = "";
    }, error => {
      console.log('Error: ', error)
      this.loading = false
      //generic error message for now.  Can implement more complex validation later.
    });
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

}
