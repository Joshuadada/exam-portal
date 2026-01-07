import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ExaminerResultService } from '../../../../../core/services/examiner/examiner-result-service/examiner-result-service';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';
import { LecturerResultType } from '../../../../../core/types/result.type';
import { MinutesToHoursPipe } from "../../../../../core/pipes/minutes-to-hours-pipe";

@Component({
  selector: 'app-result-details',
  imports: [CommonModule, RouterModule, MinutesToHoursPipe],
  templateUrl: './result-details.html',
  styleUrl: './result-details.scss',
})
export class ResultDetails implements OnInit {
  private resultService = inject(ExaminerResultService)
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private destroy$ = new Subject<void>();
  resultData!: LecturerResultType | null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getLecturerResult(id);
    });
  }

  getLecturerResult(id: string): void {
    this.resultService.getLecturerStudentResultBySubmissionId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.resultData = res.data || null;
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

  backToResults() {
    // Prefer going back; otherwise navigate to results list
    // this.router.navigate(['../'], { relativeTo: this.route }).catch(() => {
    //   this.router.navigate(['/examiner/results']);
    // });
    this.router.navigate(['/examiner/results']);
  }
}
