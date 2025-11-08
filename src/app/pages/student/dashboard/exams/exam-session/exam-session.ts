import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

type Subpart = {
  id: string;
  label: string;
  question: string;
  answer: string;
};

type Question = {
  id: number;
  subparts: Subpart[];
};

@Component({
  selector: 'app-exam-session',
  imports: [CommonModule, FormsModule, NgxEditorModule, RouterModule],
  templateUrl: './exam-session.html',
  styleUrl: './exam-session.scss',
})
export class ExamSession implements OnDestroy {
  private router = inject(Router)
  timeRemaining = signal(60 * 60);
  currentQuestionIndex = signal(0);
  editors: Map<string, Editor> = new Map();
  
  // Updated toolbar configuration
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  questions = signal<Question[]>([
    {
      id: 1,
      subparts: [
        {
          id: '1a',
          label: '1a',
          question: 'Explain the concept of overfitting in supervised learning.',
          answer: '',
        },
        {
          id: '1b',
          label: '1b',
          question: 'Describe two strategies to reduce overfitting and explain why they work.',
          answer: '',
        },
        {
          id: '1c',
          label: '1c',
          question: 'Give an example of overfitting and how you detected it.',
          answer: '',
        },
      ],
    },
    {
      id: 2,
      subparts: [
        {
          id: '2a',
          label: '2a',
          question: 'Discuss how LLMs can be used for automated evaluation in education.',
          answer: '',
        },
      ],
    },
    {
      id: 3,
      subparts: [
        {
          id: '3a',
          label: '3a',
          question: 'Define supervised learning.',
          answer: '',
        },
        {
          id: '3b',
          label: '3b',
          question: 'Define unsupervised learning.',
          answer: '',
        },
      ],
    },
  ]);

  private timerInterval?: number;

  constructor() {
    // Initialize editors for all subparts
    this.questions().forEach(q => {
      q.subparts.forEach(sp => {
        // Create editor with proper configuration
        const editor = new Editor({
          history: true,
          keyboardShortcuts: true,
          inputRules: true,
        });
        this.editors.set(sp.id, editor);
      });
    });

    this.startTimer();

    // Autosave effect
    effect(() => {
      localStorage.setItem('examAnswers', JSON.stringify(this.questions()));
    });
  }

  ngOnDestroy(): void {
    // Clear timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    // Destroy all editors
    this.editors.forEach(editor => editor.destroy());
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
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex.set(index);
  }

  isQuestionAnswered(index: number) {
    const q = this.questions()[index];
    return q.subparts.some(sp => (sp.answer || '').trim().length > 0);
  }

  getAnsweredSubparts(q: Question): string {
    const answered = q.subparts.filter(sp => (sp.answer || '').trim().length > 0).length;
    return `${answered}/${q.subparts.length}`;
  }

  submitExam() {
    const answers = this.questions().map(q => ({
      questionId: q.id,
      subparts: q.subparts.map(sp => ({ id: sp.id, answer: sp.answer })),
    }));

    this.router.navigate(['/student/exams/result'])
  }
}