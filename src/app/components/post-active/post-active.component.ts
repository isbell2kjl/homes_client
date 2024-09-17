import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-active',
  templateUrl: './post-active.component.html',
  styleUrls: ['./post-active.component.css']
})
export class PostActiveComponent implements OnInit {

  // @ViewChild("myinput") myInputField!: ElementRef;

  postList: Post[] = [];

  Comments?: [] = [];

  currentUser?: string = "";
  currentUserId: number = 0;

  searchText: string = "";
  postLength: number = 0;
  archived: boolean = false;


  constructor(private postService: PostService, private userService: UserService,
    private router: Router, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {

    this.loadTasks();

  }

  //When page loads, set the focus to the input field. (See Above)
  // ngAfterViewInit() {
  //   this.myInputField.nativeElement.focus();
  // }

  loadTasks() {
    this.postService.getAllPosts().subscribe(foundposts => {
      // this.postList = foundposts;
      this.postList = foundposts.filter(function (active, index) {
        return active.archive == 0
      });
      this.postLength = this.postList.length;
    });

    this.getCurrentUser();

  }

  getCurrentUser() {
    if (this.userService.currentUserValue) {
      this.userService.getCurrentUser().subscribe(response => {
        this.currentUser = response.userName;
        this.currentUserId = response.userId!;
        console.log('Current User Id: ', this.currentUserId);
      });
    } else (window.alert("In order to edit content, you must log in."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))
  }

  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  //if user types a search string in lower case, capitalize the first letter
  //to avoid the 'search string not found' error.
  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }

  //If active, use this search
  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundSearch => {
        console.log(foundSearch);
        this.postList = foundSearch.filter(function (active, index) {
          return active.archive == 0
        });
        this.postLength = this.postList.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all users.
    else (this.loadTasks())
  }

  //If archived, use this search
  searchByKeywordA(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundSearch => {
        console.log(foundSearch);
        this.postList = foundSearch.filter(function (active, index) {
          return active.archive == 1
        });
        this.postLength = this.postList.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all archived users.
    else (this.onArchive())
  }

  onArchive() {
    if (this.archived === true) {
      this.postService.getAllPosts().subscribe(foundposts => {
        // this.postList = foundposts;
        this.postList = foundposts.filter(function (active, index) {
          return active.archive == 1
        });
        this.postLength = this.postList.length;
      })
    }
    else (this.loadTasks())
  }

  onDelete(post_Id: string) {
    if (confirm("Are you sure you want to delete this item, including all action details?")) {
      this.postService.deletePostByID(post_Id).subscribe(response => {
        console.log(response);
        this.loadTasks();
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