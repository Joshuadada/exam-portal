import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExamType } from '../../../../core/types/exam.type';
import { MinutesToHoursPipe } from "../../../../core/pipes/minutes-to-hours-pipe";
import { Subject, takeUntil } from 'rxjs';
import { Exam } from '../../../../core/services/student/exam/exam';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';

@Component({
  selector: 'app-exams',
  imports: [CommonModule, RouterModule, MinutesToHoursPipe],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  private router = inject(Router);
  private examService = inject(Exam)
  private alertService = inject(AlertService)
  private destroy$ = new Subject<void>();

  exams = signal<ExamType[]>([]);

  ngOnInit() {
    this.getExams();
  }

  getExams() {
    this.examService
      .getExams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.exams.set(res.data || [])
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

  startExam(examId: string) {
    this.router.navigate(['/student/exams/instruction', examId])
  }
}
