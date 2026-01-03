import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Exam } from '../../../../../core/services/student/exam/exam';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';

type Subpart = {
  id: string;
  label: string;
  question: string;
  answer: string;
  marks: number;
};

type Question = {
  id: number;
  number: number;
  subparts: Subpart[];
};

type ExamData = {
  id: string;
  title: string;
  courseCode: string;
  examinerName: string;
  duration: number;
  examDate: string;
  instructions: string;
  totalMarks: number;
  questions: Array<{
    number: number;
    subQuestions: Array<{
      label: string;
      questionText: string;
      marks: number;
      markingGuide: string;
    }>;
  }>;
};

@Component({
  selector: 'app-exam-session',
  imports: [CommonModule, FormsModule, NgxEditorModule, RouterModule],
  templateUrl: './exam-session.html',
  styleUrl: './exam-session.scss',
})
export class ExamSession implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private examService = inject(Exam);
  private alertService = inject(AlertService);
  private destroy$ = new Subject<void>();

  timeRemaining = signal(60 * 60);
  currentQuestionIndex = signal(0);
  editors: Map<string, Editor> = new Map();
  examId: string = '';

  // Exam metadata
  examData = signal<ExamData | null>(null);
  isLoading = signal(true);

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  questions = signal<Question[]>([]);

  private timerInterval?: number;

  constructor() {
    // Autosave effect
    effect(() => {
      if (this.questions().length > 0) {
        localStorage.setItem('examAnswers', JSON.stringify(this.questions()));
      }
    });
  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.examId) {
      this.alertService.error('Invalid exam ID');
      this.router.navigate(['/student/exams']);
      return;
    }

    this.getExamById();
  }

  getExamById(): void {
    this.examService
      .getExamById(this.examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true && res.data) {
            this.examData.set(res.data);
            this.initializeExam(res.data);
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
            this.router.navigate(['/student/exams']);
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'Failed to load exam');
          console.error('Exam API error:', err);
          this.router.navigate(['/student/exams']);
        },
      });
  }

  private initializeExam(data: ExamData): void {
    // Transform API data to component format
    const transformedQuestions: Question[] = data.questions.map((q, qIndex) => ({
      id: qIndex + 1,
      number: q.number,
      subparts: q.subQuestions.map((sq) => ({
        id: `${q.number}${sq.label}`,
        label: `${q.number}${sq.label}`,
        question: sq.questionText,
        answer: '',
        marks: sq.marks,
      })),
    }));

    this.questions.set(transformedQuestions);

    // Check for saved answers in localStorage
    const savedAnswers = localStorage.getItem('examAnswers');
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        // Merge saved answers with questions
        const merged = transformedQuestions.map((q) => {
          const saved = parsed.find((sq: Question) => sq.id === q.id);
          if (saved) {
            return {
              ...q,
              subparts: q.subparts.map((sp) => {
                const savedSp = saved.subparts.find((ssp: Subpart) => ssp.id === sp.id);
                return savedSp ? { ...sp, answer: savedSp.answer } : sp;
              }),
            };
          }
          return q;
        });
        this.questions.set(merged);
      } catch (e) {
        console.error('Failed to parse saved answers:', e);
      }
    }

    // Initialize editors for all subparts
    this.questions().forEach((q) => {
      q.subparts.forEach((sp) => {
        const editor = new Editor({
          history: true,
          keyboardShortcuts: true,
          inputRules: true,
        });
        this.editors.set(sp.id, editor);
      });
    });

    // Set timer based on exam duration (convert minutes to seconds)
    this.timeRemaining.set(data.duration * 60);
    this.startTimer();

    this.isLoading.set(false);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.editors.forEach((editor) => editor.destroy());
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEditor(subpartId: string): Editor {
    return this.editors.get(subpartId)!;
  }

  get currentQuestion() {
    return this.questions()[this.currentQuestionIndex()];
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const remaining = this.timeRemaining() - 1;
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam();
      } else {
        this.timeRemaining.set(remaining);
      }
    }, 1000) as any;
  }

  formatTime(sec: number): string {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex.set(index);
  }

  isQuestionAnswered(index: number) {
    const q = this.questions()[index];
    return q.subparts.some((sp) => (sp.answer || '').trim().length > 0);
  }

  getAnsweredSubparts(q: Question): string {
    const answered = q.subparts.filter((sp) => (sp.answer || '').trim().length > 0).length;
    return `${answered}/${q.subparts.length}`;
  }

  getExamTitle(): string {
    const data = this.examData();
    return data ? `${data.courseCode} - ${data.title}` : 'Exam Session';
  }

  getTotalMarks(): number {
    return this.examData()?.totalMarks || 0;
  }

  submitExam() {
    // TODO: Implement submit logic
    const answers = this.questions().map((q) => ({
      questionNumber: q.number,
      subparts: q.subparts.map((sp) => ({
        label: sp.label,
        answer: sp.answer,
      })),
    }));

    console.log('Exam answers:', answers);
    localStorage.removeItem('examAnswers');
    this.router.navigate(['/student/exams/result']);
  }
}