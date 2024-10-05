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

  filtered: string = '';
  filterKeyword: string = '';
  userList: User[] = [];
  searchText: string = "";

  // User variables
  currentUser?: string = "";
  currentUserId: number = 0;
  refreshExpire: Date = new Date();

  constructor(private userService: UserService, private router: Router,) { }

  ngOnInit(): void {
    //retreive the search keyword previously saved in the User Service, if it exists.
    this.filterKeyword = this.userService.getFilterKeyword();
    this.getCurrentUser();
    this.getFilteredUsers();
  }

  //if no search kewyord exists, show all the users.
  getAllUsers() {
    this.filtered = "";
    this.userService.getAllUsers().subscribe(data => {
      if (data) {
        this.userList = data;
        this.userService.setFilterKeyword("");
      }
    });
  }
 

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUserId = response.userId!;
      // console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("Access timeout, you must log in again.");
        //This removes the username from the Menu
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

  //filter the list when the user types a value in the input field.
  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.userService.getUsersBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundUsers => {
        console.log(foundUsers);
        this.userList = foundUsers;
        this.filterKeyword = searchkeyword;
        // Set the filterkeyword in the userService variable for later retrieval.
        this.userService.setFilterKeyword(this.filterKeyword);
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all users.
    else (this.getAllUsers())
  }

  //If the search keyword exists, filter the list.
  getFilteredUsers() {
    if (this.filterKeyword) {
      this.userService.getUsersBySearch(this.capitalizeFirstLetter(this.filterKeyword)).subscribe(foundUsers => {
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
