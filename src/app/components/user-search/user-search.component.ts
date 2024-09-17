import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
// import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})

export class UserSearchComponent {

  userList: User[] = [];
  searchText: string = "";

  // User variables
  currentUser?: string = "";
  currentUserId: number = 0;
  refreshExpire: Date = new Date();

  constructor(private userService: UserService, private router: Router,) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getAllUsers();

  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      if (data) {
        this.userList = data;
      }
    });
  }


  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUser = response.userName;
      this.currentUserId = response.userId!;
      // console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("In order to edit content, you must log in.");
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }
    });
  }

  //if user types a search string in lower case, capitalize the first letter
  //to avoid the 'search string not found' error.
  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }

  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.userService.getUsersBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundUsers => {
        console.log(foundUsers);
        this.userList = foundUsers;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all users.
    else (this.getAllUsers())
  }
}
