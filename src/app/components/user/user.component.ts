import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  id: string = "";
  fkeyId: number = 0;
  currentUserId: number = 0;
  currentPostId: string = "";

  searchText: string = "";
  postLength: number = 0;

  selectedUser: User = new User();
  postList: Post[] = [];

  constructor(private userService: UserService, private postService: PostService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['id']);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.fkeyId = Number(this.id);

    this.userService.getUserByID(this.id).subscribe(foundUser => {
      this.selectedUser = foundUser;
    })

    this.postService.getUserPosts(this.fkeyId).subscribe(foundposts => {
      console.log(foundposts);
      this.postList = foundposts.filter(function(active, index) {
        return active.archive == 1
      });
      this.postLength = this.postList.length
    });

    // get the current user ID from local storage
      this.userService.getCurrentId()
      console.log(this.userService.currentId)
      this.currentUserId = this.userService.currentId;
      console.log("current UserID " + this.currentUserId);
    }

  // onComment(post_Id: string) {
  //       this.postService.getPostByID(post_Id).subscribe(foundpost => {
  //         console.log(foundpost);
  //         this.currentPostId = foundpost.postId!;
  //       });
  //     }

  //if user types a search string in lower case, capitalize the first letter
  //to avoid the 'search string not found' error.
  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }
  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundSearch => {
        console.log(foundSearch);
        this.postList = foundSearch.filter(function(active, index) {
          return active.archive == 1
        });
        this.postLength = this.postList.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all posts.
    else 
      (this.postService.getUserPosts(this.fkeyId).subscribe(foundposts => {
      console.log(foundposts);
      this.postList = foundposts.filter(function(active, index) {
        return active.archive == 1
      });
    }));
  }
    
  onDelete(post_Id: string) {
    if (confirm("Are you sure you want to delete this item, including all action details?")) {
      this.postService.deletePostByID(post_Id).subscribe(response => {
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
