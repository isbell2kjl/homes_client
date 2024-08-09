import { Component } from '@angular/core';
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

  currentUserId: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.CheckCurrentUser();
  }



  public getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      if (data) {
        this.userList = data;
      }
    });
  }

  CheckCurrentUser() {
    // get the current user ID from local storage
    this.userService.getCurrentId()
    console.log("currentID" + this.userService.currentId)
    this.currentUserId = this.userService.currentId;
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
