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

  getAllComments(): Observable<Comment[]> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<Comment[]>(`${baseURL}/comment`, {headers: reqHeaders});
  }

  getPostComments(postId: number): Observable<Comment[]> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<Comment[]>(`${baseURL}/comment/postComment/${postId}`, { headers: reqHeaders});
  }

  createComment(newComment: Comment) {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post(`${baseURL}/comment`, newComment, {headers: reqHeaders });
  }

  getCommentByID(comId: string): Observable<Comment> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<Comment>(`${baseURL}/comment/${comId}`, { headers: reqHeaders});
  }

  editCommentByID(comId: string, data: CommentUpdate): Observable<CommentUpdate> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<CommentUpdate>(`${baseURL}/comment/${comId}`, data, { headers: reqHeaders });
  }

  deleteCommentByID(comId: string): Observable<any>  {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(`${baseURL}/comment/${comId}`,  { headers: reqHeaders })
  }

   









}
