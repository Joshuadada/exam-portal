import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Exam } from '../../../../../core/services/student/exam/exam';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';

@Component({
  selector: 'app-exam-instruction',
  imports: [],
  templateUrl: './exam-instruction.html',
  styleUrl: './exam-instruction.scss',
})
export class ExamInstruction {
  private destroy$ = new Subject<void>();
  examId: string = ''
  exam!: any

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private examService: Exam,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    // Get exam ID from route params
    this.examId = this.route.snapshot.paramMap.get('id') || '';

    this.getExamMeta();
  }

  getExamMeta(): void {
    this.examService.getExamMetaById(this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.exam = res.data || {}
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

  goBack() {
    this.router.navigate(['/student/exams']);
  }

  proceedToExam(id: string) {
    this.router.navigate([`/exam-session`, id]);
  }
}
