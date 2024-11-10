import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommentUpdate } from 'src/app/models/commentUpdate';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css']
})

export class CommentEditComponent implements OnInit, CanComponentDeactivate {

  id: string = "";
  fkeyId: number = 0;
  postId?: number = 0;
  currentUserId: number = 0;
  updatedText: CommentUpdate = {
    text: ''
  }

  //this initializes the FormGroup.
  editCommentForm = new FormGroup({
    text: new FormControl(''),
  });


  constructor(private CommentService: CommentService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      console.log(this.activatedRoute.snapshot.params['id']);
      this.id = this.activatedRoute.snapshot.params['id'];

      this.CommentService.getCommentByID(this.id).subscribe(foundComment => {
        //this assigns the current value from the database to the template.
        this.editCommentForm.patchValue(foundComment);
        this.postId = foundComment.postId_fk;
        this.fkeyId = foundComment.usrId_fk!;

        // get the current user ID from local storage if user logged in.

        this.getCurrentUser();


        console.log("current UserID " + this.currentUserId);
        console.log("current FKey_ID " + this.fkeyId);

      });

    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']))
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUserId = response.userId!;
      // console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("Access timeout, you must log in again.");
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }
    });
  }

  back(): void {
    this.location.back()
  }

   //When any value is changed, the form.dirty is set to true.
   isFormDirty(): boolean {
    return this.editCommentForm && this.editCommentForm.dirty;
  }

  onSubmit() {
    if (this.currentUserId == this.fkeyId) {
      console.log("currentId: ", this.currentUserId, this.fkeyId);
      //the next two lines assign the edited value from the template and update the database.
      this.updatedText = this.editCommentForm.value as CommentUpdate;
      this.CommentService.editCommentByID(this.id, this.updatedText).subscribe(response => {
        console.log(response);
         //this sets the form.dirty status to false.
         this.editCommentForm.markAsPristine();
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
