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
    this.userService.getAllUsers().subscribe(data => {
      if (data) {
      this.userList = data;
    }
    });
  }

  // onSearch(): void {
  //   this.userService.getAllUsers().subscribe(data => {
  //     if (data) {
  //     this.userList = this.filterPipe.transform(data,this.searchText);
  //     // this.myFilter = this.filterPipe.transform(this.userList,this.searchText);
  //   }
  //   });
  // }

}
