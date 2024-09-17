import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css']
})
export class CommentEditComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  postId?: number = 0;
  currentUserId: number = 0;


  currentComment: Comment = new Comment();

  constructor(private CommentService: CommentService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.CommentService.getCommentByID(this.id).subscribe(foundComment => {
      this.currentComment = foundComment;
      console.log("Text: " + this.currentComment.text);
      this.postId = foundComment.postId_fk;


      // get the current user ID from local storage if user logged in.

      this.getCurrentUser();

      this.fkeyId = this.currentComment.usrId_fk!;

      console.log("current UserID " + this.currentUserId);
      console.log("current FKey_ID " + this.fkeyId);

    });
  }

  getCurrentUser() {
    if (this.userService.currentUserValue) {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUserId = response.userId!;
        console.log('Current User Id: ', this.currentUserId);
      });
    } else (window.alert("In order to edit content, you must log in."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))
  }

  back(): void {
    this.location.back()
  }

  onSubmit() {
    if (this.currentUserId == this.fkeyId) {
      this.CommentService.editCommentByID(this.id, this.currentComment).subscribe(response => {
        console.log(response);
        window.alert("Edited Action Successfully");
        this.location.back();
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['signin']);
        }
      });
    } else (window.alert("You can only edit your own Actions."))
  }

}
