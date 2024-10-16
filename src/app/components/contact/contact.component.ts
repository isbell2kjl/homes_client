import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { PageContent } from 'src/app/models/page-content';
import { ContentService } from 'src/app/services/content.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  pageContent!: PageContent;

  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  loading = false;
  captcha: string | null = "";

  constructor(private contactService: ContactService, private contentService: ContentService, private router: Router) { }

  ngOnInit(): void {
    this.pageContent = this.contentService.getPageContent(); 
  }

  onSubmit() {
    this.loading = true
    this.contactService.sendContact(this.name, this.email, this.phone, this.message).subscribe(response => {
      console.log(response)
      window.alert("Thanks for your request. We'll get back to you as soon as possible");
      this.loading = false
      this.name = "";
      this.email = "";
      this.phone = "";
      this.message = "";
    }, error => {
      console.log('Error: ', error)
      this.loading = false
      //generic error message for now.  Can implement more complex validation later.
    });
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

}
