import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Result } from '../../../../../core/services/student/result/result';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { ResultType } from '../../../../../core/types/result.type';

@Component({
  selector: 'app-exam-result',
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-result.html',
  styleUrl: './exam-result.scss',
})
export class ExamResult {
  private router = inject(Router);
  private resultService = inject(Result);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute)
  private destroy$ = new Subject<void>();
  resultData!: ResultType | null;
  user = JSON.parse(localStorage.getItem('user') || "{}");

  circumference = 2 * Math.PI * 70;
  dashOffset = 0;
  scoreColor = '#22C55E';

  activeIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getStudentResult(id);
    });
  }

  getStudentResult(id: string): void {
    this.resultService.getStudentResultBySubmissionId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.resultData = res.data || null;
            const progress = (this.resultData?.percentage || 0) / 100;

            this.dashOffset = this.circumference * (1 - progress);
            this.scoreColor = progress >= 0.5 ? '#22C55E' : '#EF4444';
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

  goToResults() {
    this.router.navigate(['/student/results'])
  }
}
