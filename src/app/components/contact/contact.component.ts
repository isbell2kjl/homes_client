import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ContactService } from 'src/app/services/contact.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';
import { MyRecaptchaKey } from 'src/app/helpers/constants';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, CanComponentDeactivate {

  pageContent: Project = new Project();

  newContactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    message: new FormControl(''),
  });

  loading = false;
  captcha: string | null = "";
  siteKey = MyRecaptchaKey;

  constructor(private contactService: ContactService, private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.projectService.getPageContent().subscribe(foundProject => {
      this.pageContent = foundProject;
    })
  }

  onSubmit(event: Event) {
    //prevent the SignIn from bypassing captcha
    if (!this.captcha) {
      event.preventDefault();
      window.alert("You must verify that you're not a robot.")
      return;
    } else
      this.loading = true
      this.contactService.sendContact(
        this.newContactForm.value.name ?? '', 
        this.newContactForm.value.email ?? '', 
        this.newContactForm.value.phone ?? '', 
        this.newContactForm.value.message ?? ''
      ).subscribe(response => {
        console.log(response);
        window.alert("Thanks for your request. We'll get back to you as soon as possible");
        this.loading = false;
        this.newContactForm.reset(); // Clears the form
    }, error => {
      console.log('Error: ', error)
      this.loading = false
      //generic error message for now.  Can implement more complex validation later.
    });
  }

   //When any value is changed, the form.dirty is set to true.
   isFormDirty(): boolean {
    return this.newContactForm && this.newContactForm.dirty;
  }


  //when user checks "I'm not a robot"
  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

  //prevent the ENTER key from bypassing captcha
  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!this.captcha) {
      keyboardEvent.preventDefault();
      window.alert("You must verify that you're not a robot.")
      return;
    }
  }

}
