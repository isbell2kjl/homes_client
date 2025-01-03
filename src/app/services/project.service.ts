import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Project } from '../models/project';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';
import { PendingResponse } from '../models/pending-response';
import { UserResponse } from '../models/pending-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }

  createProject(newProject: Project) {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post(`${baseURL}/project`, newProject, {headers: reqHeaders});
  }

  //This is used to display content on public pages. The content is updated on NgOnInit() within each component.
  //For users who have their own solo website.
  getPageContent(): Observable<Project> {
    return this.http.get<Project>(`${baseURL}/project`, {});
  }

  //This is used in combination with editProjectById for modifying this content.
  getProjectById(projectId: string): Observable<Project> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<Project>(`${baseURL}/project/${projectId}`, {headers: reqHeaders});
  }

  //Check if email exists for join requests and only allow
  //if email exists and projectId >1
  checkEmail(email: string): Observable<any> {
    return this.http.get(`${baseURL}/project/check-email?email=${email}`);
  }

  //Check if email exists for new group/projects and only allow
  //if email does NOT exist.
  checkEmailTrue(email: string): Observable<any> {
    return this.http.get(`${baseURL}/project/check-email-true?email=${email}`);
  }

  editProjectById(projectId: string, editedProject: Project): Observable<Project> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Project>(`${baseURL}/project/${projectId}`, editedProject, { headers: reqHeaders});
  }

  // Method to request to join a project
  requestToJoinProject(projectEmail: string): Observable<any> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post(`${baseURL}/user/request-to-join`, { projectEmail }, { headers: reqHeaders});
  }

  getPendingRequests(projectId: number): Observable<PendingResponse> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    return this.http.get<PendingResponse>(`${baseURL}/user/pending-requests/${projectId}`, {headers: reqHeaders},
    );
  }
  
  getUserRequests(userId: number): Observable<UserResponse> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<UserResponse>(`${baseURL}/user/user-requests/${userId}`, { headers: reqHeaders });
  }

  // Method to approve a join request
  approveJoinRequest(requestId: number): Observable<Request> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post<Request>(`${baseURL}/user/approve-request/${requestId}`,{}, {headers: reqHeaders});
  }

  // project.service.ts
  rejectJoinRequest(requestId: number): Observable<Request> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.post<Request>(`${baseURL}/user/reject-request/${requestId}`, {}, {headers: reqHeaders});
  }

  deleteProjectById(projectId: string): Observable<any> {
    let tokenKey: any = this.userService.currentUserValue!.token;
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.delete<any>(`${baseURL}/project/${projectId}`, { headers: reqHeaders})
  }

}
