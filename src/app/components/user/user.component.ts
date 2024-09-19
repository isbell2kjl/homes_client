import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;
  refreshExpires: Date = new (Date);
  token: any = "";

  searchText: string = "";

  selectedUser: User = new User();


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
    private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.fkeyId = Number(this.id);
    console.log("fkeyId " + this.fkeyId)

    this.userService.getUserByID(this.id).subscribe(foundUser => {
      this.selectedUser = foundUser;
    })

    this.getCurrentUser();
  }


  getCurrentUser() {
    if (this.userService.currentUserValue) {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUserId = response.userId!;
      });
    } else (window.alert("In order to edit content, you must log in."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))
  }

  onDelete(userId: string) {
    if (confirm("Warning:  This will delete this user and all properties and actions created by this user.")) {
      this.userService.deleteUserByID(userId).subscribe(response => {
        console.log(response);
        window.alert("User Deleted Successfully");
        //this removes the current username and resets the menu
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          // this.router.navigate(['signin']);
        }
      });
    }
  }

  onNewUser() {
    if (confirm("This will log you out and open a new user sign up form.")) {
      this.userService.Signout()
      //this removes the current username and resets the menu
      this.userService.active$ = this.userService.getUserActiveState('', '');
      this.router.navigate(['auth/signupnewuser1'])
    }

  }


  back(): void {
    this.location.back()
  }

}
