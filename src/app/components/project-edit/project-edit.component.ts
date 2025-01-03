import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Project } from 'src/app/models/project';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';
import { webSite } from 'src/app/helpers/constants';


@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit, CanComponentDeactivate {

  id: string = "";
  currentUserId?: number = 0;
  currentProjectId?: number = 0;
  webSite = webSite;
  editProject: Project = new Project();

  //this initializes the FormGroup.
  editProjectForm = new FormGroup({
    projectId: new FormControl(1),
    projectName: new FormControl('My Project'),
    contactEmail: new FormControl('myproject@testmail.com'),
    siteName: new FormControl('My Project Website'),
    mainTitle: new FormControl('My Project Title'),
    mainText: new FormControl('This is the main text of my project website, that gives visitors an introduction to my main purpose'),
    tagline: new FormControl('This is a tagline to highlight and attract attention'),
    leftTitle: new FormControl('Left Title'),
    leftText: new FormControl('This is the descriptive text the goes under the left title'),
    centerTitle: new FormControl('Center Title'),
    centerText: new FormControl('This is the descriptive text the goes under the center title'),
    rightTitle: new FormControl('Right Title'),
    rightText: new FormControl('This is the descriptive text the goes under the right title'),
    contactText: new FormControl('This is the text to describe the contact person information'),
    contactPhone: new FormControl('123-456-7890'),
    users: new FormControl([]),
  });

  constructor(private projectService: ProjectService, private userService: UserService,
    private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {

  }

  ngOnInit(): void {
    // Check if there is a user logged in
    if (this.userService.currentUserValue) {

      console.log(this.activatedRoute.snapshot.params['id']);
      this.id = this.activatedRoute.snapshot.params['id'];

      // Load project data based on route params.
      this.loadProjectData(this.id);

    } else {
      window.alert("You must log in to access this path.");
      this.userService.active$ = this.userService.getUserActiveState('', '');
      this.router.navigate(['auth/signin']);
    }
  }


  loadProjectData(id: string) {
    this.projectService.getProjectById(id).subscribe(foundProject => {
      this.editProjectForm.patchValue(foundProject);
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
      this.router.navigate(['admin-dashboard']);
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
