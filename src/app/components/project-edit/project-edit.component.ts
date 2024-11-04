import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from 'src/app/models/project';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent {
  @ViewChild('form') form!: FormGroup;

  isFormDirty(): boolean {
    return this.form.dirty
  }
  
  id: string = "";
  editProject: Project = new Project();
  currentUserId?: number = 0;
  currentProjectId?: number = 0;

  constructor(private projectService: ProjectService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {

     }

    ngOnInit(): void {

      //Check if there is a user logged in. 
      // if (this.userService.currentUserValue) {
  
        console.log(this.activatedRoute.snapshot.params['id']);
        this.id = this.activatedRoute.snapshot.params['id'];

  
        this.projectService.getProjectById(this.id).subscribe(foundUser => {
          this.editProject = foundUser;
        })
  
        this.getCurrentUser();
  
      // } else (window.alert("You must log in to access this path."),
      //   this.router.navigate(['auth/signin']))
        
    }

    getCurrentUser() {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUserId = response.userId!;
        this.currentProjectId = response.projId_fk;
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

    onSubmit(): void {
      this.projectService.editProjectById(this.id, this.editProject).subscribe(response => {
        console.log(response);
        window.alert("Edited Project Successfully. '\n' Click Home on the Menu to review changes.");
        // this.router.navigate(['profile/' + this.id]);
      }, error => {
        window.alert("Project Registration Error");
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          window.alert("unauthorized user");
          this.router.navigate(['auth/signin']);
        }
      });
    }
  
    back(): void {
      this.location.back()
    }
  
}
