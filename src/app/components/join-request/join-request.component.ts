import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectRequest } from 'src/app/models/project-request';
import { ProjectService } from 'src/app/services/project.service';
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


  userProject: ProjectRequest = {
    projectId: 1,
    email: ''
  }

  requestJoinForm = new FormGroup({
    projectEmail: new FormControl('', [Validators.required, Validators.pattern(EmailFormatRegx)])
  });


  constructor(private userService: UserService, private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {

    if (this.webSite) {
      this.getAdminUsers();
    }

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
    this.loadNames(); // Load email and project name (with userName) when Form 1 is shown.
  }

  loadNames(): void {
    const contactEmail = this.userService.getCurrentEmail();
    const projectName = this.userService.getUserName();
    this.newProjectForm.patchValue({ contactEmail });
    this.newProjectForm.patchValue({ projectName });
  }


  createProject() {
    const formValues = this.newProjectForm.value;
    // Check to make sure email does not already exist
    const email = formValues.contactEmail!;
    this.projectService.checkEmailTrue(email).subscribe(
      (response) => {
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
              this.createProjectAndAssignRole(email, formValues);
            },
            (error) => {
              console.error("Error fetching admin users:", error);
            }
          );
        } else {
          // If webSite == false, proceed to create the project without restrictions
          this.createProjectAndAssignRole(email, formValues);
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
 */
  createProjectAndAssignRole(email: string, formValues: any) {

    // Prepare the new project object
    const newProjectData = {
      projectName: formValues.projectName,
      contactEmail: formValues.contactEmail
    };

    this.projectService.createProject(newProjectData).subscribe(
      (createResponse: Project) => {
        window.alert("Group created successfully")
        console.log("Group created successfully", createResponse);

        // Fetch the current user's data
        this.userService.getCurrentUser().subscribe(
          (currentUser) => {
            const updatedUser = {
              ...currentUser,
              projId_fk: createResponse.projectId, // Assign the new projectId
              role: 1, // Set the user role to admin
            };

            // Update the user in the backend
            this.userService.editUserByID(currentUser.userId, updatedUser).subscribe(
              (updateResponse) => {
                console.log("User's project and role updated successfully", updateResponse);
              },
              (updateError) => {
                console.error("Error updating user's project and role:", updateError);
              }
            );
          },
          (error) => {
            console.error("Error fetching current user:", error);
          }
        );
      },
      (createError) => {
        console.error("Error creating project:", createError);
      }
    );
  }

  requestJoin() {
    if (this.requestJoinForm.valid) {
      const email = this.requestJoinForm.value.projectEmail!;

      // Check if this user already has a pending request
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.projectService.getUserRequests(user.userId).subscribe({
            next: (response) => {
              if (response.hasUserRequests) {
                window.alert("You already have a request pending. \n Check back when group owner approves the request.")
                return; // Stop further execution
              }
              // Proceed to check if the group email is valid
              this.projectService.checkEmail(email).subscribe({
                next: () => {
                  this.projectService.requestToJoinProject(email).subscribe({
                    next: (response) => {
                      console.log("Request submitted successfully", response);
                      window.alert(
                        "Request submitted successfully. \nCheck back when group owner approves the request."
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
        },
        error: (error) => {
          console.error("Error checking user requests", error);
        },
      });
    }
  }

}
