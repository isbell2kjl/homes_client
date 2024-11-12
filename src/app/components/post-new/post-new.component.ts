import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/guards/unsaved-changes.interface';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})


export class PostNewComponent implements OnInit, CanComponentDeactivate {

  //this initializes the FormGroup.
  newPostForm = new FormGroup({
    address: new FormControl(''), //address
    city: new FormControl(''), //city
    state: new FormControl(''), //state
    zip: new FormControl(''), //zip
    owner: new FormControl(''), //owner
    telephone: new FormControl(''), //telephone
    call: new FormControl(''), //call status
    condition: new FormControl(''), //condition
    delinquent: new FormControl(''), //delinquint status
    bed: new FormControl(''), //bed
    bath: new FormControl(''), //bath
    sqft: new FormControl(''), //square feet
    zestimate: new FormControl(''), //Zestimate
    offer: new FormControl(''),//My offer
    notes: new FormControl(''),
    visible: new FormControl(0),
  });

  newPost: Post = new Post();
  addressString: string = '';
  concatenatedString: string = '';
  currentUserId?: number = 0;


  constructor(private postService: PostService, private userService: UserService, private router: Router,
    private location: Location
  ) { }


  ngOnInit(): void {

    //Check if there is a user logged in.
    if (this.userService.currentUserValue) {

      // Map `visible` control values between true/false and 1/0
      this.newPostForm.get('visible')?.valueChanges.subscribe((checked) => {
        this.newPostForm.patchValue({ visible: checked ? 1 : 0 }, { emitEvent: false });
      });


      this.getCurrentUser();

    } else (window.alert("You must log in to access this path."),
      this.router.navigate(['auth/signin']))

  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(response => {
      this.currentUserId = response.userId!;
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
      this.newPostForm.get('address')?.value,
      this.newPostForm.get('city')?.value,
      this.newPostForm.get('state')?.value,
      this.newPostForm.get('zip')?.value
    ].filter(value => value).join(', ');
  }

  updateConcatenatedString() {
    this.concatenatedString = [
      'Own-' + this.newPostForm.get('owner')?.value,
      'Tel-' + this.newPostForm.get('telephone')?.value,
      'Call-' + this.newPostForm.get('call')?.value,
      'Cond-' + this.newPostForm.get('condition')?.value,
      'Delq-' + this.newPostForm.get('delinquent')?.value,
      this.newPostForm.get('bed')?.value + 'bd',
      this.newPostForm.get('bath')?.value + 'ba',
      this.newPostForm.get('sqft')?.value + 'sqft',
      '$' + this.newPostForm.get('zestimate')?.value,
      '$' + this.newPostForm.get('offer')?.value,
      this.newPostForm.get('notes')?.value
    ]
      .filter(value => value) // Filter out null/undefined/empty values
      .join(', '); // Join with a comma and space
  }

  back(): void {
    this.location.back()
  }

  //When any value is changed, the form.dirty is set to true.
  isFormDirty(): boolean {
    return this.newPostForm && this.newPostForm.dirty;
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
      this.newPostForm.reset();
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
