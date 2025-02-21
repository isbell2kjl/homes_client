import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { ViewportScroller, Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.css']
})
export class CommentNewComponent implements OnInit, CanComponentDeactivate {

  commentList: Comment[] = [];


  id: string = "";
  numId: number = 0
  userFkeyId?: number = 0;

  currentUser?: string = "";
  currentUserId: number = 0;

  currentPost: Post = new Post();

  newComment: Comment = new Comment();

  //this initializes the FormGroup, 
  // only used for "text" property
  newCommentForm = new FormGroup({
    text: new FormControl(''),
  });

  currentContent?: string = "";
  currentPostDate?: Date = new Date();
  currentPhoto?: string = "";
  currentAddress?: string = "";
  postUser?: string = "";
  postUsrId?: number = 0;

  constructor(private postService: PostService, private commentService: CommentService, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router, private viewportScroller: ViewportScroller,
    private location: Location) { }

  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      this.loadTasks();

    } else {
      window.alert("You must log in to access this path.");
      this.userService.signOut();  // Sign out the user if not logged in.
      this.router.navigate(['auth/signin']);
    }
  }

  loadTasks() {

    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];

    this.postService.getPostByID(this.id).subscribe(foundPost => {
      this.currentPost = foundPost;

      this.numId = Number(this.currentPost.postId)
      this.currentContent = this.currentPost.content
      this.currentPostDate = new Date(this.currentPost.posted + 'Z')
      this.currentPhoto = this.currentPost.photoURL
      this.currentAddress = this.currentPost.title
      this.postUser = this.currentPost.userName
      this.postUsrId = this.currentPost.userId_fk

      this.commentService.getPostComments(this.numId).subscribe(response => {
        // Transform comDate to Date object
        this.commentList = response.map(comment => ({
          ...comment,
          comDate: new Date(comment.comDate + 'Z')  // Convert comDate to Date object
        }));
      });
      

    });

    this.currentUser = this.userService.getUserName();
    this.currentUserId = this.userService.getUserId();
    this.userFkeyId = this.currentUserId;


  }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  back(): void {
    this.location.back()
  }

  //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.newCommentForm && this.newCommentForm.dirty;
  }

  addComment() {
    //assign foreign keys to newComment object values.
    this.newComment.usrId_fk = this.userFkeyId;
    this.newComment.postId_fk = Number(this.id);
    //assign the new Text entered by user to the newComment object's text value.
    this.newComment.text = this.newCommentForm.get('text')?.value!;
    //use the newComment object to update the database.
    this.commentService.createComment(this.newComment).subscribe(() => {
      window.alert("Created Comment Successfully");
      this.loadTasks();
      // Reset the text control to an empty string, which also sets formControl to 'pristine'
      this.newCommentForm.get('text')?.reset('');
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

  onDeletePost(post_Id: string) {
    if (confirm("Are you sure you want to delete this item, including all action details?")) {
      this.postService.deletePostByID(post_Id).subscribe(response => {
        console.log(response);
        // this.loadTasks();
        // window.alert("Deleted Post Successfully");
        this.router.navigate(['active']);
      }, error => {
        console.log('Error: ', error)
        if (error.status === 401 || error.status === 403) {
          // this.router.navigate(['signin']);
        }
      });
    }
  }

}
