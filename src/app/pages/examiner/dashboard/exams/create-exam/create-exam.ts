import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.scss',
})
export class CreateExam implements OnInit, OnDestroy {
  examForm: FormGroup;
  instructionsEditor!: Editor;

  questionEditors: Editor[][] = [];
  markingGuideEditors: Editor[][] = [];

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
      number: ['', Validators.required],
      subQuestions: this.fb.array([
        this.createSubQuestionGroup(qIndex, 0),
      ]),
    });
  }

  createSubQuestionGroup(qIndex: number, sIndex: number): FormGroup {
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

    this.questionEditors[qIndex][sIndex]?.destroy();
    this.markingGuideEditors[qIndex][sIndex]?.destroy();

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

  /* ---------- SUBMIT ---------- */

  onSubmit(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.examForm.value,
      questions: this.questions.controls.map((q: any) => ({
        number: q.value.number,
        subQuestions: q.value.subQuestions.map((sq: any) => ({
          label: sq.label,
          questionText: sq.questionText,
          marks: sq.marks,
          markingGuide: sq.markingGuide,
        })),
      })),
    };

    console.log('Exam Created:', payload);
    alert('Exam created successfully!');
  }
}
