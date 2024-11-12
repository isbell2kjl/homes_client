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

  filterKeyword: string = "";

  postList: Post[] = [];

  Comments?: [] = [];

  projectId: number = 0;

  currentUser?: string = "";
  currentUserId: number = 0;
  postLength: number = 0;

  archived: boolean = false;


  constructor(private postService: PostService, private userService: UserService,
    private router: Router, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {

    if (this.userService.currentUserValue) {

    this.projectId = this.userService.getProjectId()
    

      //retreives the search keyword previously saved in the Post Service, if it exists.
      this.filterKeyword = this.postService.getFilterKeyword();

      //Retreives from the Post Service the boolean true, if dataset is archived, or false, if dataset is active.
      this.archived = this.postService.getArchiveFilter();


      //If the dataset is archived BUT there is NO search keyword, apply the archived ALL filter.
      if (this.archived == true && !this.filterKeyword) {

        this.onArchive();

        //If the dataset is NOT archived, BUT there IS a search keyword, apply the active search filter.
      } else if (this.archived == false && this.filterKeyword) {

        this.applyFilterToList();

        //If the dataset IS archived AND there is a search keyword, apply the Archived search filter.
      } else if (this.archived == true && this.filterKeyword) {

        this.applyFilterToListA();

        // If the dataset is NOT archived AND there is NO search keyword, load ALL the data.   
      } else (this.loadAll())

    } else (window.alert("You must log in to access this path."),
      this.userService.active$ = this.userService.getUserActiveState('', ''),
      this.router.navigate(['auth/signin']))

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

    this.getCurrentUser();

  }

  //Apply the active search filter if the the keyword exists.
  applyFilterToList() {
    if (this.filterKeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(this.filterKeyword),this.projectId).subscribe(foundSearch => {
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
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(this.filterKeyword),this.projectId).subscribe(foundSearch => {
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

  //Retreive the current user from User Service and assign the name and userId to the variables.
  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUser = response.userName;
      this.currentUserId = response.userId!;
      console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("Access timeout, you must log in again.");
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }
    });
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
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword),this.projectId).subscribe(foundSearch => {
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
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword),this.projectId).subscribe(foundSearch => {
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