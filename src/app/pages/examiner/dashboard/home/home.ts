import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Dashboard } from '../../../../core/services/examiner/dashboard/dashboard';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { ExamType } from '../../../../core/types/exam.type';
import { Router } from '@angular/router';
import { MinutesToHoursPipe } from "../../../../core/pipes/minutes-to-hours-pipe";

type RecentExams = {
  id: string,
  title: string,
  courseCode: string,
  creatorId: string,
  examinerName: string,
  duration: number,
  examDate: string,
  totalMarks: number,
  createdAt: string
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MinutesToHoursPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private dashboardService = inject(Dashboard);
  private alertService = inject(AlertService);
  private router = inject(Router)
  private destroy$ = new Subject<void>();

  user = JSON.parse(localStorage.getItem('user') || '{}')
  examinerName = this.user.full_name || 'Lecturer'
  recentExams: ExamType[] = []

  summaryCards = [
    { label: 'Total Exams', value: 0, icon: 'fas fa-book' },
    { label: 'Students', value: 0, icon: 'fas fa-users' },
  ];

  ngOnInit() {
    this.getRecentExams();
    this.getDashboardData();
  }

  getRecentExams() {
    this.dashboardService
      .getExaminerRecentExams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.recentExams = res.data || []
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Recent exam API error:', err);
        },
      });
  }

  getDashboardData() {
    this.dashboardService
      .getExaminerDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.summaryCards = [
              { label: 'Total Exams', value: res.data?.examCount || 0, icon: 'fas fa-book' },
              { label: 'Enrolled Students', value: res.data?.studentCount || 0, icon: 'fas fa-users' },
            ];
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Recent exam API error:', err);
        },
      });
  }

  viewAll() {
    this.router.navigate(['/examiner/exams'])
  }
}
