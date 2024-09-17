import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { ViewportScroller, Location } from '@angular/common';

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.css']
})
export class CommentNewComponent implements OnInit {

  commentList: Comment[] = [];


  id: string = "";
  numId: number = 0
  userFkeyId?: number = 0;

  currentUser?: string = "";
  currentUserId: number = 0;

  currentPost: Post = new Post();



  currentContent?: string = "";
  currentPostDate?: string = "";
  currentPhoto?: string = "";
  currentAddress?: string = "";
  postUser?: string = "";
  postUsrId?: number = 0;


  newComment: Comment = new Comment();



  constructor(private postService: PostService, private commentService: CommentService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private viewportScroller: ViewportScroller,
    private location: Location) { }

  ngOnInit(): void {

    this.loadTasks();

  }



  loadTasks() {

    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.postService.getPostByID(this.id).subscribe(foundPost => {
      this.currentPost = foundPost;

      this.numId = Number(this.currentPost.postId)
      this.currentContent = this.currentPost.content
      this.currentPostDate = this.currentPost.posted
      this.currentPhoto = this.currentPost.photoURL
      this.currentAddress = this.currentPost.title
      this.postUser = this.currentPost.userName
      this.postUsrId = this.currentPost.userId_fk

      console.log("postUser: " + this.postUser)


      this.commentService.getPostComments(this.numId).subscribe(response => {
        this.commentList = response;
      });

    });

    this.getCurrentUser();

  }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  getCurrentUser() {
    if (this.userService.currentUserValue) {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUser = response.userName;
        this.currentUserId = response.userId!;
        this.userFkeyId = this.currentUserId;
        console.log('Current User Id: ', this.currentUserId);
      });
    } else (window.alert("In order to edit content, you must log in."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))
  }

  back(): void {
    this.location.back()
  }

  addComment() {
    this.newComment.usrId_fk = this.userFkeyId;
    this.newComment.postId_fk = Number(this.id);

    this.commentService.createComment(this.newComment).subscribe(() => {
      window.alert("Created Comment Successfully");
      this.loadTasks();
      this.newComment.text = "";
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        this.router.navigate(['auth/signin']);
      }
    });
  }

  onDelete(comment_Id: string) {
    if (confirm("Are you sure you want to delete this item?")) {
      this.commentService.deleteCommentByID(comment_Id).subscribe(response => {
        console.log(response);
        this.ngOnInit();
        // window.alert("Deleted Post Successfully");
        // this.router.navigate(['add']);
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          // this.router.navigate(['signin']);
        }
      });
    }
  }

}
