import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from "@angular/common";
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';


@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit, CanComponentDeactivate {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;
  archive?: number = 0;

  //this initializes the FormGroup.
  editPostForm = new FormGroup({
    postId: new FormControl(''),
    title: new FormControl(''),
    content: new FormControl(''),
    photoURL: new FormControl(''),
    visible: new FormControl(0),
    archive: new FormControl(0),
    userId_fk: new FormControl(0),
    userName: new FormControl(''),
    posted: new FormControl(''),
    comment: new FormControl([]),
  });

  updatedPost: Post = new Post();

  constructor(private postService: PostService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      console.log(this.activatedRoute.snapshot.params['id']);
      this.id = this.activatedRoute.snapshot.params['id'];

      this.postService.getPostByID(this.id).subscribe(foundPost => {
        //this assigns the current values from the database to the template.
        this.editPostForm.patchValue(foundPost);
        //this variable to be used later.
        this.fkeyId = foundPost.userId_fk!;
        // Map `visible` control values between true/false and 1/0
        this.editPostForm.get('visible')?.valueChanges.subscribe((checked) => {
          this.editPostForm.patchValue({ visible: checked ? 1 : 0 }, { emitEvent: false });
        });

        // Map `archive` control values between true/false and 1/0
        this.editPostForm.get('archive')?.valueChanges.subscribe((checked) => {
          this.editPostForm.patchValue({ archive: checked ? 1 : 0 }, { emitEvent: false });
        });

        // get the current user ID from local storage if user logged in.
        this.getCurrentUser();

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
    return this.editPostForm && this.editPostForm.dirty;
  }

  onSubmit() {
    //Only allow the user who created the record to update it.
    if (this.currentUserId == this.fkeyId) {
      //the next two lines assign the edited values from the user to update the database.
      this.updatedPost = this.editPostForm.value as Post;
      this.postService.editPostByID(this.id, this.updatedPost).subscribe(response => {
        console.log(response);
        window.alert("Edited Post Successfully");
        //this sets the form.dirty status to false.
        this.editPostForm.reset();
        this.location.back();
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['signin']);
        }
      });
    } else (window.alert("You can only edit your own posts."))
  }
}
