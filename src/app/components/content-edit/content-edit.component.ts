import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PageContent } from 'src/app/models/page-content';
import { UserService } from 'src/app/services/user.service';
import { ContentService } from 'src/app/services/content.service';



@Component({
  selector: 'app-content-edit',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './content-edit.component.html',
  styleUrl: './content-edit.component.css'
})
export class ContentEditComponent {

  pageContent!: PageContent;
  currentUserId: number = 0;

  constructor(private userService: UserService, private contentService: ContentService, private router: Router) { }

  ngOnInit(): void {
    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {
      this.pageContent = this.contentService.getPageContent();
      this.userService.getCurrentUser().subscribe({
        next: (response) => {
          //check if user is admin.  UserID 1 is always admin, the first person to sign up for an account.
          if (response.userId == 1 ) {
            this.currentUserId = response.userId!;
          } else 
            (window.alert("You must be the admin user toaccess this path."),
              this.router.navigate(['active']))
        },
        error: (error) => {
          console.error('Error retrieving userId');
          if (error.status === 401 || error.status === 403) {
            window.alert("Access timeout, you must log in again.");
            this.userService.active$ = this.userService.getUserActiveState('', '');
            this.router.navigate(['auth/signin']);
          }
        }
      });
    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']));
  }

  onSubmit(): void {
    this.contentService.updatePageContent(this.pageContent);
    alert('Content updated');
  }

}
