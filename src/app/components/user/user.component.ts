import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;

  searchText: string = "";

  selectedUser: User = new User();


  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.fkeyId = Number(this.id);

    this.userService.getUserByID(this.id).subscribe(foundUser => {
      this.selectedUser = foundUser;
    })

    // get the current user ID from local storage
      this.userService.getCurrentId()
      console.log(this.userService.currentId)
      this.currentUserId = this.userService.currentId;
      console.log("current UserID " + this.currentUserId);
    }

}
