import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Project } from '../models/project';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';
import { PendingResponse } from '../models/pending-response';
import { UserResponse } from '../models/pending-response';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private http: HttpClient, private userService: UserService, private router: Router) { }

  createProject(newProject: Project) {
    // Check the newProject object to ensure it has all the required fields
    console.log('Creating project with data:', newProject);

    return this.http.post<Project>(`${baseURL}/project`, newProject)
    .pipe(
      catchError((error) => {
        console.error('Error in createProject service:', error);
        return throwError(error); // Rethrow the error to be caught in the component
      })
    );
  }

  //This is used to display content on public pages. The content is updated on NgOnInit() within each component.
  //For users who have their own solo website.
  getPageContent(): Observable<Project> {
    return this.http.get<Project>(`${baseURL}/project`, {});
  }

  //This is used in combination with editProjectById for modifying this content.
  getProjectById(projectId: string): Observable<Project> {
    return this.http.get<Project>(`${baseURL}/project/${projectId}`);
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
    return this.http.put<Project>(`${baseURL}/project/${projectId}`, editedProject);
  }

  // Method to request to join a project
  requestToJoinProject(projectEmail: string): Observable<any> {
    return this.http.post(`${baseURL}/user/request-to-join`, { projectEmail });
  }

  getPendingRequests(projectId: number): Observable<PendingResponse> {
    return this.http.get<PendingResponse>(`${baseURL}/user/pending-requests/${projectId}`);
  }

  getUserRequests(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${baseURL}/user/user-requests/${userId}`);
  }

  // Method to approve a join request
  approveJoinRequest(requestId: number): Observable<Request> {
    return this.http.post<Request>(`${baseURL}/user/approve-request/${requestId}`, {});
  }

  // project.service.ts
  rejectJoinRequest(requestId: number): Observable<Request> {
    return this.http.post<Request>(`${baseURL}/user/reject-request/${requestId}`, {});
  }

  sendWeeklyReports(projectId: number): Observable<string> {
    return this.http.get<string>(`${baseURL}/project/send-weekly-reports/${projectId}`);
  }

  deleteProjectById(projectId: string): Observable<any> {
    return this.http.delete<any>(`${baseURL}/project/${projectId}`)
  }
}
