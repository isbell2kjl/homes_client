import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
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
  projectId: number = 0;

  // User variables
  currentUser?: string = "";
  currentUserId: number = 0;
  refreshExpire: Date = new Date();

  constructor(private userService: UserService, private router: Router, private location: Location) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      this.projectId = this.userService.getProjectId()
      


      //retreive the search keyword previously saved in the User Service, if it exists.
      this.filterKeyword = this.userService.getFilterKeyword();
      this.currentUserId = this.userService.getUserId();

      this.getFilteredUsers();

    } else {
      window.alert("You must log in to access this path.");
      this.userService.signOut();  // Sign out the user if not logged in.
      this.router.navigate(['auth/signin']);
    	}
  }

  //if no search kewyord exists, show all the users.
  getAllUsers() {
    this.filtered = "";
    this.userService.getAllUsers(String(this.projectId)).subscribe(data => {
      if (data) {
        this.userList = data;
        this.userService.setFilterKeyword("");
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
      this.userService.getUsersBySearch(this.capitalizeFirstLetter(searchkeyword),this.projectId).subscribe(foundUsers => {
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
      this.userService.getUsersBySearch(this.capitalizeFirstLetter(this.filterKeyword),this.projectId).subscribe(foundUsers => {
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

  back(): void {
    this.location.back()
  }

}
