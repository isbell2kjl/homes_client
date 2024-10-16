import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})


export class PostNewComponent implements OnInit {


  newPost: Post = new Post();

  column01: string = ''; //address
  column02: string = ''; //city
  column03: string = ''; //state
  column04: string = ''; //zip
  column1: string = ''; //owner
  column2: string = ''; //telephone
  column3: string = ''; //call status
  column4: string = ''; //condition
  column5: string = ''; //delinquint status
  column6: string = ''; //bed
  column7: string = ''; //bath
  column8: string = ''; //square feet
  column9: string = ''; //Zestimate
  column10: string = '';//My offer
  notes: string = '';
  addressString: string = '';
  concatenatedString: string = '';

  quote: any;
  searchText: string = "";


  currentUser?: string = "";
  currentUserId?: number = 0;


  constructor(private postService: PostService, private userService: UserService, private router: Router,
    private location: Location
  ) { }


  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {
      
      this.getCurrentUser();

    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']))

  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUserId = response.userId!;
      // console.log('Current User Id: ', this.currentUserId);
    }, error => {
      console.log('Error: ', error)
      if (error.status === 401 || error.status === 403) {
        window.alert("Access timeout, you must log in again.");
        this.userService.active$ = this.userService.getUserActiveState('', '');
        this.router.navigate(['auth/signin']);
      }
    });
  }

  updateAddressString() {
    this.addressString = [
      this.column01,
      this.column02,
      this.column03,
      this.column04
    ].join(', ');
  }

  updateConcatenatedString() {
    this.concatenatedString = [
      ('Own-' + this.column1),
      ('Tel-' + this.column2),
      ('Call-' + this.column3),
      ('Cond-' + this.column4),
      ('Delq-' + this.column5),
      (this.column6 + 'bd'),
      (this.column7 + 'ba'),
      (this.column8 + 'sqft'),
      ('$' + this.column9),
      ('$' + this.column10),
      this.notes
      // ].join('\t');
    ].join(', ');
  }

  back(): void {
    this.location.back()
  }

  addPost() {
    this.newPost.userId_fk = this.currentUserId;
    this.updateAddressString();
    this.newPost.title = this.addressString;

    // Make sure address field has a value before performing continuning.
    if (this.newPost.title?.length! > 0) {
      this.updateConcatenatedString();
      this.newPost.content = this.concatenatedString;
    }

    this.postService.createPost(this.newPost).subscribe(() => {
      window.alert("Created Post Successfully");
      this.getCurrentUser();
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
        console.log("Token time out.")
        this.router.navigate(['auth/signin']);
      }
    });
  }

}
