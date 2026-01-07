import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExaminerResultService } from '../../../../core/services/examiner/examiner-result-service/examiner-result-service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { LecturerResultSummaryType } from '../../../../core/types/result.type';

interface StudentResult {
  name: string;
  matricNo: string;
  courseCode: string;
  courseTitle: string;
  ExamDate: string;
  score: number;
  grade: string;
  status: 'Passed' | 'Failed';
}

@Component({
  selector: 'app-result',
  imports: [CommonModule, RouterModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  private router = inject(Router)
  private resultService = inject(ExaminerResultService)
  private alertService = inject(AlertService)
  private destroy$ = new Subject<void>();

  results: LecturerResultSummaryType[] = [];

  ngOnInit(): void {
    this.getResults();
  }

  getResults(): void {
    this.resultService.getLecturerStudentResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.results = res.data || []
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Exam API error:', err);
        },
      });
  }

  viewDetails(submissionId: string) {
    this.router.navigate(['/examiner/results/details', submissionId])
  }
}
