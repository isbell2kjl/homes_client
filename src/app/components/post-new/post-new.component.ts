import { Component, OnInit} from '@angular/core';
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

  // @ViewChild("myinput") myInputField!: ElementRef;

  newPost: Post = new Post();

  column1: string = '';
  column2: string = '';
  column3: string = '';
  column4: string = '';
  column5: string = '';
  column6: string = '';
  column7: string = '';
  column8: string = '';
  column9: string = '';
  column10: string = '';
  notes: string = '';
  concatenatedString: string = '';

  quote: any;
  searchText: string = "";

  // contentTemplate: string = "own: ,tel: ,cond: ugly ,dlnq: n  ,zest: $  , bd: , ba: , / sqft ,ofr: $ ,call-0 ";



  currentUser?: string = "";
  currentUserId: number = 0;


  constructor(private postService: PostService, private userService: UserService, private router: Router) { }


  ngOnInit(): void {

    this.loadTasks();
  }

  //When page loads, set the focus to the input field. (See Above)
  // ngAfterViewInit() {
  //   this.myInputField.nativeElement.focus();
  // }

  loadTasks() {
    if (this.userService.currentUserValue) {
      this.currentUser = this.userService.currentUserValue.userName;
      this.userService.getCurrentId();
      this.currentUserId = this.userService.currentId;
      console.log(this.currentUser);
      console.log(this.currentUserId);
    } else (window.alert("In order to create content, you must log in."),
      this.router.navigate(['auth/signin']))
  }

  updateConcatenatedString() {
    this.concatenatedString = [
      this.column1,
      this.column2,
      ('Call-' + this.column3),
      this.column4,
      ('delq-' + this.column5),
      (this.column6 + 'bd'),
      (this.column7 + 'ba'),
      (this.column8 + 'sqft'),
      ('$' + this.column9),
      ('$' + this.column10),
      this.notes
    ].join('\t');
  }

  addPost() {
    this.newPost.userId_fk = this.currentUserId;

    // Make sure address field has a value before performing functions.
    if (this.newPost.title?.length! > 0) {
      this.updateConcatenatedString();
      this.newPost.content = this.concatenatedString;
    }

    this.postService.createPost(this.newPost).subscribe(() => {
      window.alert("Created Post Successfully");
      this.loadTasks();
      this.newPost.title = "";
      this.newPost.content = "";
      this.column1 = "";
      this.column2 = "";
      this.column3 = "";
      this.column4 = "";
      this.column5 = "";
      this.column6 = "";
      this.column7 = "";
      this.column8 = "";
      this.column9 = "";
      this.column10 = "";
      this.notes = "";
      this.router.navigate(['active']);
    }, error => {
      console.log('Error: ', error)
      window.alert("Both address and description are required.")
      if (error.status === 401 || error.status === 403) {
        this.router.navigate(['auth/signin']);
      }
    });
  }

}
