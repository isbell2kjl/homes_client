import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
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
  currentUserId?: number = 0;
  editUserForm!: FormGroup;
  currentUserRole: number = 0;
  initialUserName: string | undefined;
  initialEmail: string | undefined;

  editUser: User = new User();

  constructor(private userService: UserService, private projectService: ProjectService, private activatedRoute: ActivatedRoute, 
    private router: Router, private location: Location, private formbuilder: FormBuilder) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      this.editUserForm = this.formbuilder.group({
        userId: [0],
        password: [''],
        firstName: [''],
        lastName: [''],
        email: [null, [Validators.required, Validators.pattern(EmailFormatRegx)]],
        userName: [null, [Validators.required, Validators.minLength(6)]],
        city: [''],
        state: [''],
        country: [''],
        created: [''],
        posts: [[]],
        content: [''],
        token: [''],
        refreshToken: [''],
        refreshTokenExpires: [null],
        terms: [0],
        privacy: [0],
        projId_fk: [0],
        role: [0],
      });

      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserId = user.userId;
          this.currentUserRole = user.role;

          console.log(this.activatedRoute.snapshot.params['id']);
          this.id = this.activatedRoute.snapshot.params['id'];


          this.userService.getUserByID(this.id).subscribe(foundUser => {
            //this assigns the current values from the database to the template.
            this.editUserForm.patchValue(foundUser);

            // Store initial values for comparison
            this.initialUserName = foundUser.userName;
            this.initialEmail = foundUser.email;
          })

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

  back(): void {
    this.location.back()
  }

  //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.editUserForm && this.editUserForm.dirty;
  }

  onSubmit() {
    console.log("debug current user ID vs found userId", this.currentUserId, this.id);

    if (this.currentUserId == Number(this.id)) {
      if (!this.editUserForm.valid) {
        window.alert('Please provide all the required values!');
        return;
      }

      // Step 1: Update the user
      this.editUser = this.editUserForm.value;
      this.userService.editUserByID(this.id, this.editUser).subscribe(
        response => {
          console.log("User updated successfully:", response);
          this.editUserForm.markAsPristine();
          window.alert("Edited User Successfully");

          // Step 2: Check if `UserName` or `Email` were updated
          const projId = this.editUserForm.value.projId_fk;
          const updatedProject: any = {};
          let projectUpdateNeeded = false;

          if (this.editUserForm.value.userName !== this.initialUserName) {
            updatedProject.projectName = this.editUserForm.value.userName;
            projectUpdateNeeded = true;
          }
          if (this.editUserForm.value.email !== this.initialEmail) {
            updatedProject.contactEmail = this.editUserForm.value.email;
            projectUpdateNeeded = true;
          }

          console.log("Updating project with:", updatedProject);
          console.log("Project ID:", projId);

          // Step 3: Update the project only if necessary and user is an admin (role == 1)
          if (projectUpdateNeeded && projId && this.currentUserRole === 1) {

            window.alert("You may need to edit your group details as well.")
            this.router.navigate(['/project', projId]);
            // this.projectService.editProjectById(String(projId), updatedProject).subscribe(
            //   () => {
            //     console.log("Group/Project updated successfully");
            //     window.alert("Since you are the group owner, the corresponding group name and email were also updated");
            //     this.router.navigate(['profile/' + this.id]);
            //   },
            //   error => {
            //     console.error("Error updating group/project:", error);
            //     window.alert("Error updating the group");
            //   }
            // );
          } else if (projectUpdateNeeded && this.currentUserRole !== 1) {
            console.log("Current user is not an admin. Skipping group/project update.");
            this.router.navigate(['profile/' + this.id]);
          } else {
            console.log("No changes detected for project");
            this.router.navigate(['profile/' + this.id]);
          }
        },
        error => {
          console.error("User update error:", error);
          window.alert("User Registration Error");
          if (error.status === 401 || error.status === 403) {
            window.alert("Unauthorized user");
          }
        }
      );
    } else {
      window.alert("You can only edit your own profile.");
    }
  }

}
