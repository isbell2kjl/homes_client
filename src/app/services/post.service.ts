import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Post } from '../models/post';
import { UserService } from './user.service';
// import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private archived: boolean = false;
  private filterKeyword: string = '';

  baseURL: string = 'https://myproperties.ddns.net/api';


  constructor(private http: HttpClient, private userService: UserService) { }


  //four filter functions to set and retrieve the filters in the post-active component.
 //the purpose of this is to perserve the filter when the user clicks the detail and returns to the list.
  setFilterKeyword(keyword: string) {
    this.filterKeyword = keyword;
  }
  setArchiveFilter(archive: boolean) {
    this.archived = archive;
  }

  getFilterKeyword(): string {
    return this.filterKeyword;
  }
  
  getArchiveFilter(): boolean {
    return this.archived;
  }
  
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}/post`);

  }

  getPostsBySearch(searchKeyword: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}/post/search?name=${searchKeyword}`);

  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseURL}/post/userpost/${userId}`);

  }

  createPost(newPost: Post) {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    console.log(reqHeaders);
    return this.http.post(`${this.baseURL}/post`, newPost, { headers: reqHeaders });
  
  }

  getPostByID(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseURL}/post/${postId}`);
  }

  editPostByID(postId: string, edittedPost: Post): Observable<Post> {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Post>(`${this.baseURL}/post/${postId}`, edittedPost, { headers: reqHeaders });
  } 

  deletePostByID(postId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(`${this.baseURL}/post/${postId}`,  { headers: reqHeaders })

  }

}
