import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Exam } from '../../../../../core/services/examiner/exam/exam';
import { Subject, takeUntil } from 'rxjs';
import { CreateExamType } from '../../../../../core/types/exam.type';
import { AlertService } from '../../../../../core/services/shared/alert/alert.service';

interface SubQuestion {
  label: string;
  questionText: string;
  marks: number;
  markingGuide: string;
}

interface Question {
  number: string;
  subQuestions: SubQuestion[];
}

interface ExamPayload {
  title: string;
  courseCode: string;
  instructions: string;
  duration: number;
  questions: Question[];
}

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.scss',
})
export class CreateExam implements OnInit, OnDestroy {
  private examService = inject(Exam)
  private alertService = inject(AlertService)
  private destroy$ = new Subject<void>();

  examForm: FormGroup;
  instructionsEditor!: Editor;

  questionEditors: Editor[][] = [];
  markingGuideEditors: Editor[][] = [];

  user = JSON.parse(localStorage.getItem('user') || "{}")

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private fb: FormBuilder) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      courseCode: ['', Validators.required],
      instructions: ['', Validators.required],
      duration: ['', Validators.required],
      examinerName: ['', Validators.required],
      examDate: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.instructionsEditor = new Editor();
    this.addQuestion();
  }

  ngOnDestroy(): void {
    this.instructionsEditor?.destroy();
    this.questionEditors.flat().forEach(ed => ed?.destroy());
    this.markingGuideEditors.flat().forEach(ed => ed?.destroy());
  }

  /* ---------- FORM HELPERS ---------- */

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  getSubQuestions(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('subQuestions') as FormArray;
  }

  createQuestion(): FormGroup {
    const qIndex = this.questions.length;

    this.questionEditors[qIndex] = [];
    this.markingGuideEditors[qIndex] = [];

    return this.fb.group({
      subQuestions: this.fb.array([
        this.createSubQuestionGroup(qIndex, 0),
      ]),
    });
  }

  createSubQuestionGroup(qIndex: number, sIndex: number): FormGroup {
    // Initialize arrays if they don't exist
    if (!this.questionEditors[qIndex]) {
      this.questionEditors[qIndex] = [];
    }
    if (!this.markingGuideEditors[qIndex]) {
      this.markingGuideEditors[qIndex] = [];
    }

    this.questionEditors[qIndex][sIndex] = new Editor();
    this.markingGuideEditors[qIndex][sIndex] = new Editor();

    return this.fb.group({
      label: ['', Validators.required],
      questionText: ['', Validators.required],
      marks: ['', Validators.required],
      markingGuide: [''],
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    if (this.questions.length <= 1) return;

    this.questionEditors[index]?.forEach(ed => ed?.destroy());
    this.markingGuideEditors[index]?.forEach(ed => ed?.destroy());

    this.questionEditors.splice(index, 1);
    this.markingGuideEditors.splice(index, 1);
    this.questions.removeAt(index);
  }

  addSubQuestion(qIndex: number): void {
    const subArray = this.getSubQuestions(qIndex);
    subArray.push(this.createSubQuestionGroup(qIndex, subArray.length));
  }

  removeSubQuestion(qIndex: number, sIndex: number): void {
    const subArray = this.getSubQuestions(qIndex);
    if (subArray.length <= 1) return;

    this.questionEditors[qIndex]?.[sIndex]?.destroy();
    this.markingGuideEditors[qIndex]?.[sIndex]?.destroy();

    this.questionEditors[qIndex].splice(sIndex, 1);
    this.markingGuideEditors[qIndex].splice(sIndex, 1);
    subArray.removeAt(sIndex);
  }

  getSubQuestionEditor(qIndex: number, sIndex: number): Editor | null {
    return this.questionEditors[qIndex]?.[sIndex] ?? null;
  }

  getSubQuestionMarkingEditor(qIndex: number, sIndex: number): Editor | null {
    return this.markingGuideEditors[qIndex]?.[sIndex] ?? null;
  }

  // Helper method for tracking in template
  trackByIndex(index: number): number {
    return index;
  }

  /* ---------- SUBMIT ---------- */

  onSubmit(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    const payload: CreateExamType = {
      ...this.examForm.value,
      creatorId: this.user.id || '',
      questions: this.questions.controls.map((q, index) => {
        const questionGroup = q as FormGroup;
        const subQuestionsArray = questionGroup.get('subQuestions') as FormArray;

        return {
          number: index + 1,
          subQuestions: subQuestionsArray.controls.map((sq) => {
            const subQuestionGroup = sq as FormGroup;
            return {
              label: subQuestionGroup.get('label')?.value,
              questionText: subQuestionGroup.get('questionText')?.value,
              marks: subQuestionGroup.get('marks')?.value,
              markingGuide: subQuestionGroup.get('markingGuide')?.value,
            };
          }),
        };
      }),
    };

    this.examService
      .createExam(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.alertService.success(res?.message);
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Create Exam API error:', err);
        },
      });
  }
}