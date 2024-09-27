import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;
  archive?: number = 0;


  currentPost: Post = new Post();

  constructor(private postService: PostService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router,
    private location: Location) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.postService.getPostByID(this.id).subscribe(foundPost => {
      this.currentPost = foundPost;
      // console.log("Photo Url: " + this.currentPost.photoURL);
      // console.log("Content: " + this.currentPost.content);
      this.archive = foundPost.archive


      // get the current user ID from local storage if user logged in.

      this.getCurrentUser();

      this.fkeyId = this.currentPost.userId_fk!;

      // console.log("current UserID " + this.currentUserId);
      // console.log("current FKey_ID " + this.fkeyId);


    });
  }

  // getCurrentUser() {
  //   if (this.userService.currentUserValue) {
  //     this.userService.getCurrentUser().subscribe(response => {
  //       this.currentUserId = response.userId!;
  //     });
  //   } else (window.alert("In order to edit content, you must log in."),
  //     this.userService.active$ = this.userService.getUserActiveState('', ''),
  //     this.router.navigate(['auth/signin']))
  // }

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

  onSubmit() {
    if (this.currentUserId == this.fkeyId) {
      this.postService.editPostByID(this.id, this.currentPost).subscribe(response => {
        console.log(response);
        window.alert("Edited Post Successfully");
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
