import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { EmailFormatRegx } from 'src/app/helpers/constants';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, CanComponentDeactivate {

  id: string = "";
  editUser: User = new User();
  currentUserId?: number = 0;
  editUserForm!: FormGroup;


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location, private formbuilder: FormBuilder) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      console.log(this.activatedRoute.snapshot.params['id']);
      this.id = this.activatedRoute.snapshot.params['id'];

      //this initializes the form
      this.newFormGroup();

      this.userService.getUserByID(this.id).subscribe(foundUser => {
        this.editUser = foundUser;

      //this populates the form with the existing values before edit.
      this.oldFormGroup();

      })



      this.getCurrentUser();

    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']))

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

  //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.editUserForm && this.editUserForm.dirty;
  }

  oldFormGroup() {
    this.editUserForm = this.formbuilder.group({
      firstName: [this.editUser.firstName],
      lastName: [this.editUser.lastName],
      email: [this.editUser.email, [Validators.required, Validators.pattern(EmailFormatRegx)]],
      userName: [this.editUser.userName, [Validators.required, Validators.minLength(6)]],
      city: [this.editUser.city],
      state: [this.editUser.state],
      country: [this.editUser.country],
    });
  }

  newFormGroup() {
    this.editUserForm = this.formbuilder.group({
      firstName: [''],
      lastName: [''],
      email: [null, [Validators.required, Validators.pattern(EmailFormatRegx)]],
      userName: [null, [Validators.required, Validators.minLength(6)]],
      city: [''],
      state: [''],
      country: [''],
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
          //this sets the form.dirty status to false.
          this.editUserForm.markAsPristine();
          // console.log("Form Dirty Status", this.editUserForm.dirty)
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
