import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Exam } from '../../../../core/services/examiner/exam/exam';
import { Subject, takeUntil } from 'rxjs';
import { ExamType } from '../../../../core/types/exam.type';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { MinutesToHoursPipe } from "../../../../core/pipes/minutes-to-hours-pipe";

@Component({
  selector: 'app-exams',
  imports: [CommonModule, RouterModule, MinutesToHoursPipe],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams implements OnInit {
  private router = inject(Router)
  private examService = inject(Exam)
  private destroy$ = new Subject<void>();
  private alertService = inject(AlertService);
  exams: ExamType[] = []

  ngOnInit() {
    this.getExams();
  }

  getExams() {
    this.examService
      .getExaminerExams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.exams = res.data || []
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

  getStatusClass(status: string) {
    return status === 'Published'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  }

  onCreateExam() {
    this.router.navigate(['examiner/exams/create']);
  }

  onEdit(id: string) {
    this.router.navigate(['examiner/exams/edit'])
  }

  onView(id: string) {
    this.router.navigate(['examiner/exams/details', id])
  }

  onDelete(id: string) {
    this.examService.deleteExam(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.alertService.success(res?.message, 'Delete');
            this.getExams();
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
}
