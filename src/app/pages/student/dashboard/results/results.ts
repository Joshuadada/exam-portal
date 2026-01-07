import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { Result } from '../../../../core/services/student/result/result';
import { Subject, takeUntil } from 'rxjs';
import { ResultSummaryType } from '../../../../core/types/result.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private alertService = inject(AlertService)
  private resultService = inject(Result)
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  examId: string = ''
  circumference = 2 * Math.PI * 40;

  searchTerm = '';
  selectedFilter = 'all';

  results: ResultSummaryType[] = [];

  ngOnInit(): void {
    this.getStudentResults();
  }

  getStudentResults(): void {
    this.resultService.getStudentResults()
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

  getDashOffset(score: number) {
    const progress = (score / 100) * this.circumference;
    return this.circumference - progress;
  }

  viewDetails(submissionId: string) {
    this.router.navigate(['/student/results', submissionId]);
  }
}
