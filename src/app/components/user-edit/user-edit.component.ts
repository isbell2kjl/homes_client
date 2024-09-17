import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {

  id: string = "";
  editUser: User = new User();
  currentUserId?: number = 0;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.userService.getUserByID(this.id).subscribe(foundUser => {
      this.editUser = foundUser;
      // this.editUser.password = "";
    })

    this.getCurrentUser();
  }

  getCurrentUser() {
    if (this.userService.currentUserValue) {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUserId = response.userId!;
        // console.log('Current User Id: ', this.currentUserId);
      });
    } else (window.alert("In order to edit content, you must log in."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))
  }

  back(): void {
    this.location.back()
  }

  onSubmit() {
    //only allow users to edit their own profiles
    if (this.currentUserId == Number(this.id)) {
      this.userService.editUserByID(this.id, this.editUser).subscribe(response => {
        console.log(response);
        window.alert("Edited User Successfully");
        this.router.navigate(['profile/' + this.id]);
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          window.alert("unauthorized user");
          this.router.navigate(['auth/signin']);
        }
      });
    } else (window.alert("You can only edit your own profile."))
  }


}
