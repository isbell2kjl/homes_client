import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job';
import { UserService } from './user.service';
import { baseURL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient, private userService: UserService) { }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${baseURL}/job`);
  }

  createJob(newJob: Job) {
    return this.http.post(`${baseURL}/job`, newJob);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${baseURL}/job/${id}`);
  }

  editJobById(id: number, edittedJob: Job): Observable<Job> {
    return this.http.put<Job>(`${baseURL}/job/${id}`, edittedJob);
  }

  deleteJobById(id: number): Observable<any> {
    return this.http.delete<any>(`${baseURL}/job/${id}`)
  }
}

