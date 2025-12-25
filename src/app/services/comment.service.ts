import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Comment } from '../models/comment';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';
import { CommentUpdate } from '../models/commentUpdate';

@Injectable({
  providedIn: 'root'
}) 
export class CommentService {

 
  constructor(private http: HttpClient, private userService: UserService) { }

  //Example of method with headers that is NOT needed. Handeled by auth-interceptor.service.ts
  // getAllComments(): Observable<Comment[]> {
  //   let tokenKey: any = this.userService.currentUserValue!.token;
  //   let reqHeaders = {
  //     Authorization: `Bearer ${tokenKey}`
  //   }
  //   return this.http.get<Comment[]>(`${baseURL}/comment`, {headers: reqHeaders});
  // }

  getPostComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${baseURL}/comment/postComment/${postId}`);
  }

  createComment(newComment: Comment) {
    return this.http.post(`${baseURL}/comment`, newComment);
  }

  getCommentByID(comId: string): Observable<Comment> {
    return this.http.get<Comment>(`${baseURL}/comment/${comId}`);
  }

  editCommentByID(comId: string, data: CommentUpdate): Observable<CommentUpdate> {
    return this.http.put<CommentUpdate>(`${baseURL}/comment/${comId}`, data);
  }

  deleteCommentByID(comId: string): Observable<any>  {
    return this.http.delete<any>(`${baseURL}/comment/${comId}`)
  }

   









}
