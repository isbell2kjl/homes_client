import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ContactService } from 'src/app/services/contact.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';
import { MyRecaptchaKey } from 'src/app/helpers/constants';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, CanComponentDeactivate, OnDestroy {

  pageContent: Project = new Project();

  newContactForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    message: new FormControl(''),
    recaptcha: new FormControl('', Validators.required)
  });

  loading = false;
  captcha: string | null = null;
  siteKey = MyRecaptchaKey;

  constructor(private contactService: ContactService, private userService: UserService,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getPageContent().subscribe(foundProject => {
      this.pageContent = foundProject;
    })
  }

  onRecaptchaResolved(token: string | null): void {
    if (token) {
      this.newContactForm.get('recaptcha')?.setValue(token);
      this.captcha = token;
      // Call the backend or process the token
    } else {
      this.newContactForm.get('recaptcha')?.setValue('');  // Clear the value if token is null
      console.warn('reCAPTCHA failed or returned null');
      // Handle the case when token is null (e.g., show an error)
    }
  }

  onSubmit() {
    // Prevent the sign-in process from bypassing the captcha
    if (this.newContactForm.valid && this.captcha) {

      this.userService.verifyRecaptcha(this.captcha).subscribe({
        next: (response) => {
          console.log('reCAPTCHA verified successfully', response);

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
            // Reset the reCAPTCHA after a failed attempt
            this.captcha = null;
            grecaptcha.reset();
          });
        },
        error: (err) => {
          window.alert("Invalid reCAPTCHA.");
          console.error('Invalid reCAPTCHA', err);
        }
      });
    }
  }

  //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.newContactForm && this.newContactForm.dirty;
  }

  ngOnDestroy() {
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  }


}
