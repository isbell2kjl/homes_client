import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailFormatRegx } from 'src/app/helpers/constants';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {

  id: string = "";
  editUser: User = new User();
  currentUserId?: number = 0;
  editUserForm!: FormGroup;


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.newFormGroup();

    this.userService.getUserByID(this.id).subscribe(foundUser => {
      this.editUser = foundUser;

      this.oldFormGroup();

    })

    this.getCurrentUser();


  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUserId = response.userId!;
      // console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("Access timeout, you must log in again.");
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }
    });
  }

  back(): void {
    this.location.back()
  }

  oldFormGroup() {
    this.editUserForm = new FormGroup({
      firstName: new FormControl(this.editUser.firstName),
      lastName: new FormControl(this.editUser.lastName),
      email: new FormControl(this.editUser.email, [Validators.required, Validators.pattern(EmailFormatRegx)]),
      userName: new FormControl(this.editUser.userName, [Validators.required, Validators.minLength(6)]),
      city: new FormControl(this.editUser.city),
      state: new FormControl(this.editUser.state),
      country: new FormControl(this.editUser.country),
    });
  }

  newFormGroup() {
    this.editUserForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(null, [Validators.required, Validators.pattern(EmailFormatRegx)]),
      userName: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      city: new FormControl(),
      state: new FormControl(),
      country: new FormControl(),
    });
  }

  onSubmit() {
    //only allow users to edit their own profiles
    if (this.currentUserId == Number(this.id)) {
      if (!this.editUserForm.valid) {
        window.alert('Please provide all the required values!');
      } else {
        this.editUser = this.editUserForm.value;
        this.userService.editUserByID(this.id, this.editUser).subscribe(response => {
          console.log(response);
          window.alert("Edited User Successfully");
          this.router.navigate(['profile/' + this.id]);
        }, error => {
          window.alert("User Registration Error");
          console.log('Error: ', error)
          if (error.status === 401 || error.status === 403) {
            window.alert("unauthorized user");
            this.router.navigate(['auth/signin']);
          }
        });
      }
    } else (window.alert("You can only edit your own profile."))
  }


}
