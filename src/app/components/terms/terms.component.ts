import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {

  constructor( private location: Location) { }

  back(): void {
    this.location.back()
  }

}
