import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Post } from '../models/post';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private archived: boolean = false;
  private filterKeyword: string = '';


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
    return this.http.get<Post[]>(`${baseURL}/post`);

  }

  getProjectPosts(projectId: string): Observable<Post[]> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    return this.http.get<Post[]>(`${baseURL}/post/project/${projectId}`, {headers: reqHeaders});

  }

  getPostsBySearch(searchKeyword: string, projectId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${baseURL}/post/search?name=${searchKeyword}&projectId=${projectId}`);
  }

  // getUserPosts(userId: number): Observable<Post[]> {
  //   return this.http.get<Post[]>(`${baseURL}/post/userpost/${userId}`);

  // }
 
  createPost(newPost: Post) {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post(`${baseURL}/post`, newPost, { headers: reqHeaders});
  }

  getPostByID(postId: string): Observable<Post> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this. http.get<Post>(`${baseURL}/post/${postId}`, {headers: reqHeaders});
  } 

  editPostByID(postId: string, edittedPost: Post): Observable<Post> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Post>(`${baseURL}/post/${postId}`, edittedPost, { headers: reqHeaders });
  } 

  deletePostByID(postId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(`${baseURL}/post/${postId}`,  { headers: reqHeaders})
  }

}
