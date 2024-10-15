import { Component, OnInit } from '@angular/core';
import { PageContent } from 'src/app/models/page-content';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageContent!: PageContent;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.pageContent = this.contentService.getPageContent(); 
  }

}
