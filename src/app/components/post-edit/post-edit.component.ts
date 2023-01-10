import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;

  currentPost: Post = new Post();

  constructor(private postService: PostService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.postService.getPostByID(this.id).subscribe(foundPost => {
      this.currentPost = foundPost;
    

    // get the current user ID from local storage if user logged in.

    this.userService.getCurrentId()
    if (this.userService.currentId > 0) {
      this.currentUserId = this.userService.currentId;
      this.fkeyId = this.currentPost.userId_fk!;
      
      console.log("current UserID " + this.currentUserId);
      console.log("current FKey_ID " + this.fkeyId );
    }

  });
  }

  onSubmit() {
    if (this.currentUserId == this.fkeyId) {
      this.postService.editPostByID(this.id, this.currentPost).subscribe(response => {
        console.log(response);
        window.alert("Edited Post Successfully");
        this.router.navigate(['add']);
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['signin']);
        }
      });
    } else (window.alert("You can only edit your own posts."))
  }
}
