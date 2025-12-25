import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { JobService } from '../../services/job.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Job } from '../../models/job';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  jobs: Job[] = [];
  hasCompletedJobs: boolean = false;
  hasIncompleteJobs: boolean = false;
  newJobControl = new FormControl('');
  currentUserId: number = 0;

  constructor(
    private jobService: JobService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.userService.currentUserValue) {
      this.currentUserId = this.userService.getUserId();
      this.userService.active$ = this.userService.getUserActiveState('active', this.userService.getUserName());
      this.loadJobs();
    } else {
      alert('You must log in.');
      this.userService.signOut();
      this.router.navigate(['auth/signin']);
    }
  }

  loadJobs(): void {
    this.jobService.getAllJobs().subscribe(jobs => {
      this.jobs = jobs;

      // compute booleans for *ngIf
      this.hasCompletedJobs = this.jobs.some(job => job.completed);
      this.hasIncompleteJobs = this.jobs.some(job => !job.completed);
    });
  }

  addJob(): void {
    const title = this.newJobControl.value?.trim();
    if (!title) return;

    const job: Job = {
      jobId: 0,
      title,
      completed: false,
      userId_fk: this.currentUserId
    };

    this.jobService.createJob(job).subscribe(() => {
      this.newJobControl.reset();
      this.loadJobs();
    });
  }

  toggleComplete(job: Job): void {
    this.jobService.editJobById(job.jobId!, {
      ...job,
      completed: !job.completed
    }).subscribe(() => this.loadJobs());
  }

  deleteJob(job: Job): void {
    if (!confirm(`Delete "${job.title}"?`)) return;

    this.jobService.deleteJobById(job.jobId!)
      .subscribe(() => this.loadJobs());
  }

  get incompleteJobs(): Job[] {
    return this.jobs.filter(j => !j.completed);
  }

  get completeJobs(): Job[] {
    return this.jobs.filter(j => j.completed);
  }

   back(): void {
    this.location.back()
  }
}
