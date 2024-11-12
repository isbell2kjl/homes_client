import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from 'src/app/models/project';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';


@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit, CanComponentDeactivate {
  
  id: string = "";
  currentUserId?: number = 0;
  currentProjectId?: number = 0;

  editProject: Project = new Project();

  //this initializes the FormGroup.
  editProjectForm = new FormGroup({
    projectId: new FormControl(0),
    projectName: new FormControl(''),
    contactEmail: new FormControl(''),
    siteName: new FormControl(''),
    mainTitle: new FormControl(''),
    mainText: new FormControl(''),
    tagline: new FormControl(''),
    leftTitle: new FormControl(''),
    leftText: new FormControl(''),
    centerTitle: new FormControl(''),
    centerText: new FormControl(''),
    rightTitle: new FormControl(''),
    rightText: new FormControl(''),
    contactText: new FormControl(''),
    contactPhone: new FormControl(''),
    users: new FormControl([]),
  });

  constructor(private projectService: ProjectService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {

     }

    ngOnInit(): void {

      //Check if there is a user logged in. 
      if (this.userService.currentUserValue) {
  
        console.log(this.activatedRoute.snapshot.params['id']);
        this.id = this.activatedRoute.snapshot.params['id'];

  
        this.projectService.getProjectById(this.id).subscribe(foundProject => {
          //this assigns the current values from the database to the template.
        this.editProjectForm.patchValue(foundProject);
        })
  
        this.getCurrentUser();
  
      } else (window.alert("You must log in to access this path."),
        this.router.navigate(['auth/signin']))
        
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
      //the next two lines assign the edited values from the user to update the database.
      this.editProject = this.editProjectForm.value as Project;
      this.projectService.editProjectById(this.id, this.editProject).subscribe(response => {
        console.log(response);
        window.alert("Edited Project Successfully. '\n' Click Home on the Menu to review changes.");
        //this sets the form.dirty status to false.
        this.editProjectForm.markAsPristine();
      }, error => {
        window.alert("Project Registration Error");
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          window.alert("unauthorized user");
          this.router.navigate(['auth/signin']);
        }
      });
    }

    //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.editProjectForm && this.editProjectForm.dirty;
  }
  
    back(): void {
      this.location.back()
    }
  
}
