import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Post } from '../models/post';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // baseURL: string = "https://localhost:7279/api/post"
baseURL: string = "https://myproperties.ddns.net/api/post"
  // baseURL: string = "https://raspberrypi4.wlan/api/post"



  constructor(private http: HttpClient, private userService: UserService) { }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseURL);

  }

  getPostsBySearch(searchKeyword: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseURL + "/search?name=" + searchKeyword);

  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseURL + "/userpost/" + userId);

  }

  createPost(newPost: Post) {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    console.log(reqHeaders);
    return this.http.post(this.baseURL, newPost, { headers: reqHeaders });
  
  }

  getPostByID(postId: string): Observable<Post> {
    return this.http.get<Post>(this.baseURL + "/" + postId);
  }

  editPostByID(postId: string, edittedPost: Post): Observable<Post> {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Post>(this.baseURL + "/" + postId, edittedPost, { headers: reqHeaders });
  }

  deletePostByID(postId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(this.baseURL + "/" + postId,  { headers: reqHeaders })

  }

}
