import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-active',
  templateUrl: './post-active.component.html',
  styleUrls: ['./post-active.component.css']
})
export class PostActiveComponent implements OnInit {

  // @ViewChild("myinput") myInputField!: ElementRef;

  filterKeyword: string = "";

  postList: Post[] = [];

  Comments?: [] = [];

  projectId: number = 0;

  currentUser?: string = "";
  currentUserId: number = 0;
  postLength: number = 0;

  archived: boolean = false;


  constructor(private postService: PostService, private userService: UserService,
    private router: Router, private viewportScroller: ViewportScroller, private snackBar: MatSnackBar) { }


  ngOnInit(): void {


    // Check if a user is logged in
    if (!this.userService.currentUserValue) {
      window.alert("You must log in to access this path.");
      this.userService.signOut();
      this.router.navigate(['auth/signin']);
      return; // Early return to prevent further execution
    }


    this.filterKeyword = this.postService.getFilterKeyword();
    this.archived = this.postService.getArchiveFilter();

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.projectId = user.projId_fk;
        //Do not allow user to proceed if they don't belong to a group. The property projId_fk == 1 is temporary
        //for users who have signed up but have not created a group or joined a group.
        if (this.projectId === 1) {
          // If no pending requests, proceed to the join-request screen.
          this.snackBar.open('Either your join request is still pending, or you need to join a group',
            'Close', { duration: 5000, verticalPosition: 'top' });
          this.router.navigate(['join-request']);
          return; // Stop further execution
        } else {
          this.userService.active$ = this.userService.getUserActiveState('active', user.userName);
          this.applyFilters(); // Unified filter logic
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });
  }

  applyFilters() {
    if (this.archived) {
      if (this.filterKeyword) {
        this.applyFilterToListA(); // Archived + Keyword
      } else {
        this.onArchive(); // Archived Only
      }
    } else {
      if (this.filterKeyword) {
        this.applyFilterToList(); // Active + Keyword
      } else {
        this.loadAll(); // Active Only
      }
    }
  }

  loadAll() {
    this.filterKeyword = "";
    this.archived = false;
    this.postService.getProjectPosts(String(this.projectId)).subscribe(foundposts => {
      // this.postList = foundposts;
      this.postList = foundposts.filter(function (active, index) {
        return active.archive == 0
      });
      this.postService.setArchiveFilter(false);
      this.postService.setFilterKeyword("");
      this.postLength = this.postList.length;
    });

  }

  // Alternative method to apply filters.
  // Define action map based on conditions
  //   const conditions = {
  //     noKeywordActive: !this.filterKeyword && !this.archived,
  //     noKeywordArchived: !this.filterKeyword && this.archived,
  //     keywordActive: this.filterKeyword && !this.archived,
  //     keywordArchived: this.filterKeyword && this.archived,
  //   };

  //   // Execute appropriate action
  //   switch (true) {
  //     case conditions.noKeywordActive:
  //       this.loadAll();
  //       break;

  //     case conditions.noKeywordArchived:
  //       this.onArchive();
  //       break;

  //     case conditions.keywordActive:
  //       this.applyFilterToList();
  //       break;

  //     case conditions.keywordArchived:
  //       this.applyFilterToListA();
  //       break;

  //     default:
  //       console.warn("Unhandled condition");
  //   }

  // }


  //Apply the active search filter if the the keyword exists.
  applyFilterToList() {
    if (this.filterKeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(this.filterKeyword), this.projectId).subscribe(foundSearch => {
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
  }

  //Apply the archived search filter if the the keyword exists.
  applyFilterToListA() {
    if (this.filterKeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(this.filterKeyword), this.projectId).subscribe(foundSearch => {
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
  }


  //On click function to return to the TOP of the form.
  public onClick(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  //if user types a search string in lower case, capitalize the first letter
  //to avoid the 'search string not found' error.
  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }

  //The active search filter is applied when the user types a value into the search input field.
  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword), this.projectId).subscribe(foundSearch => {
        console.log(foundSearch);
        this.postList = foundSearch.filter(function (active, index) {
          return active.archive == 0
        });
        this.filterKeyword = searchkeyword;
        // Set the filterkeyword in the postService variable for later retrieval.
        this.postService.setFilterKeyword(this.filterKeyword);
        this.postLength = this.postList.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field or keyword is empty, show all users.
    else (this.loadAll())
  }

  //If archived, use this search filter when user enters a search keyword into the input field.
  searchByKeywordA(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword), this.projectId).subscribe(foundSearch => {
        console.log(foundSearch);

        this.postList = foundSearch.filter(function (active, index) {
          return active.archive == 1
        });
        this.filterKeyword = searchkeyword;
        // Set the filterkeyword in the postService variable for later retrieval.
        this.postService.setFilterKeyword(this.filterKeyword);
        this.postLength = this.postList.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all archived users.
    else (this.onArchive())
  }

  //Apply or remove the archive filter when the archive toggle is changed.
  onArchive() {
    if (this.archived === true) {
      this.postService.getProjectPosts(String(this.projectId)).subscribe(foundposts => {
        // this.postList = foundposts;
        this.postList = foundposts.filter(function (active, index) {
          return active.archive == 1
        });
        this.postLength = this.postList.length;
        this.postService.setArchiveFilter(this.archived);
        this.filterKeyword = "";
        this.postService.setFilterKeyword("");
      })
    }
    else (this.loadAll())
  }
}