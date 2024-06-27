import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service'; 
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})


export class PostNewComponent implements OnInit {

  //When page loads, set the focus to the input field.  See this solution:
  //https://davidmcintosh.medium.com/auto-focusing-an-angular-input-the-easy-way-part-1-dcb1799e025f

  @ViewChild("myinput") myInputField!: ElementRef;

  newPost: Post = new Post();

  postList: Post[] = [];

  quote: any;
  searchText: string = "";
  postLength: number = 0;
  // contentTemplate: string = "own: ,tel: ,cond: ugly ,dlnq: y/n ,zil: $ ,ofr: $ ,bed: ,bath: ,sqft: / ";

 

  currentUser?: string = "";
  currentUserId: number = 0;


  constructor(private postService: PostService, private userService: UserService, private quoteService: QuoteService, private router: Router) { }


  ngOnInit(): void {
    
    // this.quoteService.getQuote().subscribe((data: any) => {
    //   console.log(data)
    //   this.quote = data;
    // });
    // this.newPost.content = this.contentTemplate;
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
        this.postLength = foundposts.length;
        
      });
      this.currentUser = this.userService.currentUserValue.userName;
      this.userService.getCurrentId();
      this.currentUserId = this.userService.currentId;
      console.log(this.currentUser);
      console.log(this.currentUserId);
    } else (window.alert("In order to create content, you must log in."),
      this.router.navigate(['auth/signin']))
  }

  //if user types a search string in lower case, capitalize the first letter
  //to avoid the 'search string not found' error.
  capitalizeFirstLetter(str: string): string {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }
  searchByKeyword(searchkeyword: any) {
    if (searchkeyword) {
      this.postService.getPostsBySearch(this.capitalizeFirstLetter(searchkeyword)).subscribe(foundSearch => {
        console.log(foundSearch);
        this.postList = foundSearch;
        //Assuming sample property is NOT part of filter, DO NOT subtract 1.
        this.postLength = foundSearch.length;
      },
        (error) => {
          console.log('Search string not found: ', error);
        })
    }
    //if search field is empty, show all users.
    else (this.loadTasks())
  }
  addPost() {
    this.newPost.userId_fk = this.currentUserId;
    this.postService.createPost(this.newPost).subscribe(() => {
      window.alert("Created Post Successfully");
      this.loadTasks();
      this.newPost.title = "";
      this.newPost.content = "";
    }, error => {
      console.log('Error: ', error)
      window.alert("Both address and description are required.")
      if (error.status === 401 || error.status === 403) {
        this.router.navigate(['auth/signin']);
      }
    });
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
