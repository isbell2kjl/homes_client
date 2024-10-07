import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Comment } from '../models/comment';
import { UserService } from './user.service';
// import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
}) 
export class CommentService {

  baseURL: string = 'https://myproperties.ddns.net/api';
 
  constructor(private http: HttpClient, private userService: UserService) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseURL}/comment`);

  }

  getPostComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseURL}/comment/postComment/${postId}`);

  }

  createComment(newComment: Comment) {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    console.log(reqHeaders);
    return this.http.post(`${this.baseURL}/comment`, newComment, { headers: reqHeaders });
  
  }

  getCommentByID(comId: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseURL}/comment/${comId}`);
  
  }

  editCommentByID(comId: string, edittedComment: Comment): Observable<Comment> {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Comment>(`${this.baseURL}/comment/${comId}`, edittedComment, { headers: reqHeaders });
  
  }

  deleteCommentByID(comId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(`${this.baseURL}/comment/${comId}`,  { headers: reqHeaders })

  }

   









}
