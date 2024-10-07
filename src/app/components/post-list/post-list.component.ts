import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {


  quote: any;

  postList: Post[] = [];

  currentPost: Post = new Post();

  Comments?: [] = [];


  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(post => {
      this.postList = post.filter(function(active, index) {
        return active.visible == 1
      });
      this.Comments = this.currentPost.comment
    });
  }

}
