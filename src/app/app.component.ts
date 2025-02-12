import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'homes_client';

  constructor(private userService: UserService) { }

  ngOnInit() {
    // // Detect page refresh and initialize the user if needed
    // this.userService.initializeUser();

    // Store refresh flag when the page unloads
    // window.addEventListener('beforeunload', () => {
    //   sessionStorage.setItem('wasRefreshed', 'true');
    // });
  }
}
