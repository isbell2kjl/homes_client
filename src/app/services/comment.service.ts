import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Comment } from '../models/comment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseURL: string = "https://localhost:7279/api/comment"
  //baseURL: string = "https://blogsitedemo.ddns.net/api/comment"
  // baseURL: string = "https://raspberrypi4.wlan/api/comment"

  constructor(private http: HttpClient, private userService: UserService) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseURL);

  }

  getPostComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseURL + "/postComment/" + postId);

  }

  createComment(newComment: Comment) {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    console.log(reqHeaders);
    return this.http.post(this.baseURL, newComment, { headers: reqHeaders });
  
  }

  getCommentByID(comId: string): Observable<Comment> {
    return this.http.get<Comment>(this.baseURL + "/" + comId);
  
  }

  editCommentByID(comId: string, edittedComment: Comment): Observable<Comment> {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Comment>(this.baseURL + "/" + comId, edittedComment, { headers: reqHeaders });
  
  }

  deleteCommentByID(comId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(this.baseURL + "/" + comId,  { headers: reqHeaders })

  }

   









}
