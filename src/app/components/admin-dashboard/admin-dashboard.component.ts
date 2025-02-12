import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { webSite } from 'src/app/helpers/constants';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  pendingRequests: any[] = [];

  pendingUser: User = new User;

  webSite = webSite;

  // User variables
  currentUser?: string = "";
  currentUserId: number = 0;
  currentProjectId: number = 0;
  currentRole: number = 0;
  loading = false;


  constructor(private projectService: ProjectService, private userService: UserService, private location: Location,
    private router: Router) { }

  ngOnInit(): void {


    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserId = user.UserId;
          this.currentProjectId = user.projId_fk;
          this.currentRole = user.role;
          this.userService.active$ = this.userService.getUserActiveState('active', user.userName);

          if (this.currentRole == 1) {
            this.loadPendingRequests();
          } else {
            window.alert("Only admin users can access this page")
            this.back();
          }
          
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

  loadPendingRequests(): void {
    this.projectService.getPendingRequests(this.currentProjectId).subscribe(response => {
      if (response.hasPendingRequests) {
        this.pendingRequests = response.requests || []; // Safeguard against null
      } else {
        this.pendingRequests = [];
      }
    });
  }

  approveRequest(requestId: number) {
    // Find the request object in the pendingRequests array
    const request = this.pendingRequests.find(req => req.requestId === requestId);

    if (!request) {
      alert('Request not found.');
      return;
    }

    // Call projectService to approve the join request
    this.projectService.approveJoinRequest(requestId).subscribe({
      next: (updatedRequest) => {
        console.log('Join request approved:', updatedRequest);

        // Update the user based on the approved request
        this.pendingUser.projId_fk = this.userService.getProjectId(); // Assign project ID
        this.pendingUser.role = 0; // Set role to normal user.

        this.userService.editUserByID(request.userId, this.pendingUser).subscribe({
          next: () => {
            alert('Request approved and user updated successfully!');
            // Remove the approved request from the pendingRequests list
            this.pendingRequests = this.pendingRequests.filter(req => req.requestId !== requestId);
          },
          error: (err) => {
            console.error('Error updating user for approved request:', err);
            alert('Failed to update the user for the approved request.');
          }
        });
      },
      error: (err) => {
        console.error('Error approving join request:', err);
        alert('Failed to approve the join request.');
      }
    });
  }



  rejectRequest(requestId: number) {
    // Find the request object in the pendingRequests array
    const request = this.pendingRequests.find(req => req.requestId === requestId);

    if (!request) {
      alert('Request not found.');
      return;
    }

    // Call the service to reject the request
    this.projectService.rejectJoinRequest(requestId).subscribe({
      next: () => {
        // Remove the rejected request from the pendingRequests list
        this.pendingRequests = this.pendingRequests.filter(req => req.requestId !== requestId);
        alert('Request rejected successfully.');
      },
      error: (err) => {
        console.error('Failed to reject request:', err);
        alert('Failed to reject the request. Please try again.');
      }
    });
  }

  onNewUser() {
    if (confirm("This will log you out and open a new user sign up form. \n Only send this link to people you know")) {
      this.userService.signOut()
      this.router.navigate(['auth/signup-newuser-now'])
    }

  }

  onSendReports(): void {
    const confirmation = window.confirm(
      'This action will generate and send a backup report of properties and actions to the group details email address. \n\n Do you want to proceed?'
    );
  
    if (confirmation) {
      this.loading = true
      this.projectService.sendWeeklyReports(this.currentProjectId)
        .pipe(
          catchError(error => {
            console.error('Error sending reports:', error);
            alert('Failed to send weekly reports.');
            this.loading = false
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            alert('Weekly reports email successfully sent.');
            this.loading = false
          }
        });
    } else {
      alert('Action canceled.');
    }
  }
  

  back(): void {
    this.location.back()
  }


}
