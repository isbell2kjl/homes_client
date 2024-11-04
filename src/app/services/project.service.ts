import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Project } from '../models/project';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private http: HttpClient, private userService: UserService) { }

  createProject(newProject: Project) {
    return this.http.post(`${baseURL}/project`, newProject);
  }


  //This is used to display content on public pages. The content is updated on NgOnInit() within each component.
  //For users who have their own solo website.
  getPageContent(): Observable<Project> {
    return this.http.get<Project>(`${baseURL}/project`, {});
  }

  //This is used in combination with editProjectById for modifying this content.
  //For users who login to the group website with multiple users and projects.
  getProjectById(projectId: string): Observable<Project> {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.get<Project>(`${baseURL}/project/${projectId}`, { headers: reqHeaders });
  }

  editProjectById(projectId: string, editedProject: Project): Observable<Project> {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }
    return this.http.put<Project>(`${baseURL}/project/${projectId}`, editedProject, { headers: reqHeaders });
  }

  deleteProjectById(projectId: string): Observable<any> {
    let tokenKey: any = this.userService.currentUserValue!.token
    let reqHeaders = {
      Authorization: `Bearer ${tokenKey}`
    }

    return this.http.delete<any>(`${baseURL}/project/${projectId}`, { headers: reqHeaders })
  }

}
