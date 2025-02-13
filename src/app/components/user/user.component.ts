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
  foundUserId: number = 0;
  currentUserRole: number = 0;
  foundUserRole: number = 0;
  currentUserId: number = 0;
  refreshExpires: Date = new (Date);
  token: any = "";

  searchText: string = "";

  selectedUser: User = new User();


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
    private router: Router, private location: Location) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      //currentUser (logged in)

      const user = this.userService.currentUserValue;
      if (user) {
        this.currentUserId = user.userId!;
        console.log("currentUserId" + this.currentUserId);
        this.userService.active$ = this.userService.getUserActiveState('active', user.userName ?? '');
      }

      //user selected/found in the user route
      this.id = this.activatedRoute.snapshot.params['id'];
      this.foundUserId = Number(this.id);
      console.log("foundUserId " + this.foundUserId)

      this.userService.getUserByID(this.id).subscribe(foundUser => {
        this.selectedUser = foundUser;
        this.foundUserRole = foundUser.role!;

      })

      //current user role
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          // console.log("User object received:", user);
          this.currentUserRole = user.role;
          console.log("role ", this.currentUserRole);

        },
        error: (err) => {
          console.error('Error fetching user:', err);
        }
      });

    } else {
      window.alert("You must log in to access this path.");
      this.userService.signOut();  // Sign out the user if not logged in.
      this.router.navigate(['auth/signin']);
    }
  }


  onDelete(userId: string) {

    //Don't allow anyone to delete the admin user. And only allow admin users to delete  other users.
    if (this.foundUserRole !== 1 && (this.currentUserId == this.foundUserId || this.currentUserRole == 1)) {
      if (confirm("Warning:  This will delete this user and all properties and actions created by this user.")) {
        this.userService.deleteUserByID(this.id).subscribe(response => {
          console.log(response);
          window.alert("User Deleted Successfully");
          this.router.navigate(['search']);
          //If a user deletes his own profile go to signin page. If admin (id=1), stay on page.
          if (this.currentUserId == this.foundUserId) {
            //this signsOut and removes the current username and resets the menu
            this.userService.signOut();
            this.userService.active$ = this.userService.getUserActiveState('', '');
            this.router.navigate(['auth/signin']);
          }
        }, error => {
          console.log('Error: ', error)
          if (error.status === 401 || error.status === 403) {
            // this.router.navigate(['signin']);
          }
        });
      }
    } else (window.alert("You cannot delete the admin account."))

  }


  back(): void {
    this.location.back()
  }

}
