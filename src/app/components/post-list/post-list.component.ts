import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { QuoteService } from 'src/app/services/quote.service';

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


  constructor(private postService: PostService, private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(post => {
      this.postList = post;
      this.Comments = this.currentPost.comment
    });
    this.quoteService.getQuote().subscribe((data: any) => {
      console.log(data)
      this.quote = data;
    });
  }

}
