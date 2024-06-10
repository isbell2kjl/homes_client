import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})


export class PostNewComponent implements OnInit {

  //When page loads, set the focus to the input field.  See this solution:
  //https://davidmcintosh.medium.com/auto-focusing-an-angular-input-the-easy-way-part-1-dcb1799e025f

  @ViewChild("myinput") myInputField!: ElementRef;

  postList: Post[] = [];

  newPost: Post = new Post();

  currentUser?: string = "";
  currentUserId: number = 0;


  constructor(private postService: PostService, private userService: UserService, private router: Router) { }


  ngOnInit(): void {
    this.loadTasks();
  }

  //When page loads, set the focus to the input field. (See Above)
  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
  }

  loadTasks() {
    if (this.userService.currentUserValue) {
      this.postService.getAllPosts().subscribe(foundposts => {
        this.postList = foundposts;
        
      });
      this.currentUser = this.userService.currentUserValue.userName;
      this.userService.getCurrentId();
      this.currentUserId = this.userService.currentId;
      console.log(this.currentUser);
      console.log(this.currentUserId);
    } else (window.alert("In order to create content, you must log in."),
      this.router.navigate(['auth/signin']))
  }
  addPost() {
    this.newPost.userId_fk = this.currentUserId;
    this.postService.createPost(this.newPost).subscribe(() => {
      window.alert("Created Post Successfully");
      this.loadTasks();
      this.newPost.content = "";
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        this.router.navigate(['auth/signin']);
      }
    });
  }

}
