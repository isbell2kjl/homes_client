import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectRequest } from 'src/app/models/project-request';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailFormatRegx } from 'src/app/helpers/constants';
import { webSite } from 'src/app/helpers/constants';

@Component({
  selector: 'app-join-request',
  templateUrl: './join-request.component.html',
  styleUrl: './join-request.component.css'
})

export class JoinRequestComponent {

  //this initializes the FormGroup.
  newProjectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.pattern(EmailFormatRegx)]),
  });

  webSite = webSite;
  admins: any[] = []; // Holds admin users fetched from the backend
  showRequestForm: boolean = false;
  showProjectForm: boolean = false;
  showButtons: boolean = true; // Used when webSite is false
  currentUser: User | null = null;

  userProject: ProjectRequest = {
    projectId: 1,
    email: ''
  }

  requestJoinForm = new FormGroup({
    projectEmail: new FormControl('', [Validators.required, Validators.pattern(EmailFormatRegx)])
  });


  constructor(private userService: UserService, private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userService.active$ = this.userService.getUserActiveState('active', user.userName);
        this.loadNames();

        if (this.webSite) {
          this.getAdminUsers();
        }

      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

  }

  getAdminUsers(): void {
    this.userService.getAdminUsers().subscribe(
      (admins) => {
        this.admins = admins;
        // Determine visibility based on admin count
        this.showRequestForm = this.admins.length > 0;
        this.showProjectForm = this.admins.length === 0;
      },
      (error) => {
        console.error('Error loading admin users:', error);
      }
    );
  }

  showRequest(): void {
    this.showRequestForm = true;
    this.showProjectForm = false;
    // this.showButtons = false;
  }

  showProject(): void {
    this.showProjectForm = true;
    this.showRequestForm = false;
    // this.showButtons = false;
  }

  loadNames(): void {
    if (this.currentUser) {

      this.newProjectForm.patchValue({
        contactEmail: this.currentUser.email,
        projectName: this.currentUser.userName
      });

    } else {
      window.alert("You must log in to access this path.");
      this.userService.signOut();
      this.router.navigate(['auth/signin']);
    }
  }

  createProject() {
    const formValues = this.newProjectForm.value;
    // console.log("Form Values: ", formValues);

    if (this.newProjectForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    // Check to make sure email does not already exist
    const email = formValues.contactEmail!;

    

    this.projectService.checkEmailTrue(email).subscribe(
      (_) => {
        // Backend returned success (NO EMAIL FOUND), proceed to create the project

        // Check the global constant `webSite`
        if (this.webSite) {
          // Fetch all users with role == 1 (admin users)
          this.userService.getAdminUsers().subscribe(
            (admins) => {
              if (admins.length > 0) {
                // If there is already an admin user, do not allow another
                window.alert("Only one admin user is allowed for this website.");
                return;
              }

              // No admin user exists, proceed to create the project
              this.createProjectAndAssignRole(formValues);
            },
            (error) => {
              console.error("Error fetching admin users:", error);
            }
          );
        } else {
          // If webSite == false, proceed to create the project without restrictions
          this.createProjectAndAssignRole(formValues);
          this.router.navigate(['/admin-dashboard']);
        }
      },
      (emailError) => {
        if (emailError.status === 400 && emailError.error === "Email is already in use.") {
          window.alert("This email already exists. Please try a different one.");
        } else {
          console.error("Error checking email:", emailError);
        }
      }
    );
  }

  /**
 * Helper function to create a project and assign the admin role to the user.
 * 
 */

  createProjectAndAssignRole(formValues: any) {
    if (!this.currentUser) {
      console.error("Current user is not available.");
      return;
    }
  
    const newProjectData = {
      projectName: formValues.projectName,
      contactEmail: formValues.contactEmail,
    };
    // console.log("newProjectData ", newProjectData);
  
    this.projectService.createProject(newProjectData).subscribe(
      (createResponse: Project) => {

        // Check response here
      // console.log('Create response:', createResponse);

      if (!createResponse || !createResponse.projectId) {
        console.error('Project creation failed: Missing projectId');
        return;
      }
      
        window.alert("Group created successfully");
        console.log("Group created successfully", createResponse);
  
        const updatedUser = {
          ...this.currentUser,
          projId_fk: createResponse.projectId, // Assign the new projectId
          role: 1, // Set the user role to admin
        };
  
        if (!this.currentUser?.userId) {
          console.error("User ID is missing.");
          return;
        }
  
        // Update the user in the backend
        this.userService.editUserByID(String(this.currentUser.userId), updatedUser).subscribe(
          (updateResponse) => {
            console.log("User's project and role updated successfully", updateResponse);
          },
          (updateError) => {
            console.error("Error updating user's project and role:", updateError);
          }
        );
      },
      (createError) => {
        console.error("Error creating project:", createError);
      }
    );
  }
  
  

  requestJoin(): void {
    if (this.requestJoinForm.valid && this.currentUser) {
      const email = this.requestJoinForm.value.projectEmail!;

      this.projectService.getUserRequests(Number(this.currentUser.userId)).subscribe({
        next: (response) => {
          if (response.hasUserRequests) {
            window.alert("You already have a request pending. \n Check back when the group owner approves the request.");
            return; // Stop further execution
          }
          // Proceed to check if the group email is valid
          this.projectService.checkEmail(email).subscribe({
            next: () => {
              this.projectService.requestToJoinProject(email).subscribe({
                next: (response) => {
                  console.log("Request submitted successfully", response);
                  window.alert(
                    "Request submitted successfully. \nCheck back when the group owner approves the request."
                  );
                  this.userService.signOut();
                  this.router.navigate(['auth/signin']);
                },
                error: (error) => {
                  console.error("Error sending join request", error);
                },
              });
            },
            error: () => {
              window.alert(
                "This group email does not exist or is not receiving requests. Try a different one."
              );
            },
          });
        },
        error: (err) => {
          console.error('Error fetching user:', err);
        }
      });
    }
  }


}
