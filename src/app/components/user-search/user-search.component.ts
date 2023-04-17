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


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  

  public getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      if (data) {
        this.userList = data;
      }
    });
  }

  searchByKeyword(searchkeyword: any) {
    this.userService.getUsersBySearch(searchkeyword).subscribe(foundUsers => {
      console.log(foundUsers);
      this.userList = foundUsers;
    },
    (error) => {
      console.log('Search string not found: ', error);
    })
  }

}
