import { Component, inject, OnInit, signal } from '@angular/core';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { Dashboard } from '../../../../core/services/student/dashboard/dashboard';
import { Subject, takeUntil } from 'rxjs';
import { ResultSummaryType } from '../../../../core/types/result.type';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private alertService = inject(AlertService);
  private dashboardService = inject(Dashboard);
  private destroy$ = new Subject<void>();

  user = JSON.parse(localStorage.getItem('user') || "{}")

  recentResults: ResultSummaryType[] = []

  // Animated signals
  totalExamsCount = signal(0);
  attemptedExamsCount = signal(0);
  averageScoreCount = signal('');

  ngOnInit(): void {
    this.getRecentResult();
    this.getDashboardData();
  }

  getRecentResult() {
    this.dashboardService
      .getRecentResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.recentResults = res.data || []
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
      .getStudentDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.totalExamsCount.set(res.data?.availableExamCount || 0)
            this.attemptedExamsCount.set(res?.data?.attemptedExamCount || 0)
            this.averageScoreCount.set(res?.data?.averageScore || '100%')
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
}
