import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {

  constructor( private location: Location) { }

  back(): void {
    this.location.back()
  }
}
