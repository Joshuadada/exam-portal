import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../../../../../core/services/examiner/exam/exam';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';
import { MinutesToHoursPipe } from "../../../../../core/pipes/minutes-to-hours-pipe";

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule, MinutesToHoursPipe],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.scss',
})
export class ExamDetails implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private examService = inject(Exam)
  private alertService = inject(AlertService)
  private destroy$ = new Subject<void>();

  exam: any | null = null;
  loading: boolean = true;
  examId: string = '';

  constructor() { }

  ngOnInit(): void {
    // Get exam ID from route params
    this.examId = this.route.snapshot.paramMap.get('id') || '';

    // Load exam details
    this.loadExamDetails();
  }

  loadExamDetails(): void {
    this.loading = true;

    this.examService.getExamById(this.examId)
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.exam = res.data
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

  editExam(): void {
    this.router.navigate(['/examiner/exams/edit']);
  }

  deleteExam(): void {
    this.examService.deleteExam(this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.alertService.success(res?.message, 'Delete');
            this.router.navigate(['/examiner/exams'])
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

  goBack(): void {
    this.router.navigate(['/exams']);
  }
}