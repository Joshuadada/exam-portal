import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar, Validators } from 'ngx-editor';

@Component({
  selector: 'app-edit-exam',
  imports: [CommonModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './edit-exam.html',
  styleUrl: './edit-exam.scss',
})
export class EditExam {
  examForm: FormGroup;
  instructionsEditor!: Editor;

  // editors per question: array of arrays -> questionEditors[qIndex][sIndex] = Editor
  questionEditors: Editor[][] = [];

  // Marking scheme file
  markingSchemeFile: File | null = null;
  markingSchemeFileName: string = '';

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
      markingScheme: [null], // Optional file upload
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // initialize the instructions editor
    this.instructionsEditor = new Editor();

    // add initial question
    this.addQuestion();
  }

  ngOnDestroy(): void {
    // safe destroy
    if (this.instructionsEditor) {
      try { this.instructionsEditor.destroy(); } catch (e) { /* ignore */ }
    }

    // destroy all question editors
    this.questionEditors.forEach(editorsForQ => {
      editorsForQ.forEach(ed => {
        try { ed.destroy(); } catch (e) { /* ignore */ }
      });
    });
    this.questionEditors = [];
  }

  // ---------- FORM HELPERS ----------

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    // Determine the qIndex before pushing so we can create editor array
    const qIndex = this.questions.length;
    // ensure an array slot for this question's editors
    this.questionEditors[qIndex] = [];

    // create initial sub-question group for this question
    const subArray = this.fb.array([this.createSubQuestionGroup(qIndex, 0)]);

    return this.fb.group({
      number: ['', Validators.required],
      subQuestions: subArray,
    });
  }

  createSubQuestionGroup(qIndex: number, sIndex: number): FormGroup {
    // create editor instance for this sub-question and store separately
    const editor = new Editor();
    // ensure questionEditors[qIndex] exists
    if (!this.questionEditors[qIndex]) {
      this.questionEditors[qIndex] = [];
    }
    this.questionEditors[qIndex][sIndex] = editor;

    return this.fb.group({
      label: ['', Validators.required],
      questionText: ['', Validators.required],
      marks: ['', Validators.required],
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      // destroy editors for this question (if any)
      const editorsForQ = this.questionEditors[index] || [];
      editorsForQ.forEach(editor => {
        if (editor) {
          try { editor.destroy(); } catch (e) { /* ignore */ }
        }
      });

      // remove the editors row and the form array entry
      this.questionEditors.splice(index, 1);
      this.questions.removeAt(index);
    }
  }

  getSubQuestions(index: number): FormArray {
    const question = this.questions.at(index) as FormGroup;
    return question.get('subQuestions') as FormArray;
  }

  addSubQuestion(qIndex: number): void {
    const subArray = this.getSubQuestions(qIndex);
    const sIndex = subArray.length;
    subArray.push(this.createSubQuestionGroup(qIndex, sIndex));
  }

  removeSubQuestion(qIndex: number, sIndex: number): void {
    const subArray = this.getSubQuestions(qIndex);
    if (subArray.length > 1) {
      // destroy the corresponding editor
      const editor = this.questionEditors[qIndex]?.[sIndex];
      if (editor) {
        try { editor.destroy(); } catch (e) { /* ignore */ }
      }

      // remove editor from array
      if (this.questionEditors[qIndex]) {
        this.questionEditors[qIndex].splice(sIndex, 1);
      }

      // remove form control
      subArray.removeAt(sIndex);
    }
  }

  getQuestionGroup(index: number): FormGroup {
    return this.questions.at(index) as FormGroup;
  }

  getSubQuestionGroup(qIndex: number, sIndex: number): FormGroup {
    return this.getSubQuestions(qIndex).at(sIndex) as FormGroup;
  }

  getSubQuestionEditor(qIndex: number, sIndex: number): Editor | null {
    return this.questionEditors[qIndex]?.[sIndex] ?? null;
  }

  // Get the instructions editor
  getInstructionsEditor(): Editor {
    return this.instructionsEditor;
  }

  // ---------- MARKING SCHEME FILE HANDLING ----------

  // Handle marking scheme file upload
  onMarkingSchemeFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF or Word documents (.pdf, .doc, .docx)');
        input.value = '';
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        input.value = '';
        return;
      }

      this.markingSchemeFile = file;
      this.markingSchemeFileName = file.name;
      this.examForm.patchValue({ markingScheme: file });
    }
  }

  // Remove marking scheme file
  removeMarkingSchemeFile(): void {
    this.markingSchemeFile = null;
    this.markingSchemeFileName = '';
    this.examForm.patchValue({ markingScheme: null });
  }

  // ---------- SUBMIT ----------

  onSubmit(): void {
    if (this.examForm.invalid) {
      console.log('Form is invalid');
      this.examForm.markAllAsTouched();
      return;
    }

    // Build a clean serializable payload (exclude internal editor instances)
    const payload = {
      title: this.examForm.get('title')?.value,
      courseCode: this.examForm.get('courseCode')?.value,
      instructions: this.examForm.get('instructions')?.value,
      duration: this.examForm.get('duration')?.value,
      markingScheme: this.markingSchemeFile ? {
        fileName: this.markingSchemeFileName,
        fileSize: this.markingSchemeFile.size,
        fileType: this.markingSchemeFile.type
      } : null,
      questions: (this.questions.controls || []).map((qGroup: any, qi: number) => {
        const q = qGroup.value;
        return {
          number: q.number,
          subQuestions: (q.subQuestions || []).map((sq: any, si: number) => ({
            label: sq.label,
            questionText: sq.questionText,
            marks: sq.marks,
          })),
        };
      }),
    };

    console.log('Exam Created:', payload);

    // If there's a marking scheme file, you would typically upload it separately
    if (this.markingSchemeFile) {
      console.log('Marking Scheme File:', this.markingSchemeFile);
      // TODO: Upload file to server using FormData
      // const formData = new FormData();
      // formData.append('markingScheme', this.markingSchemeFile);
      // this.examService.uploadMarkingScheme(formData).subscribe(...);
    }

    alert('Exam created successfully!');
    // TODO: actually send payload to server via service
  }
}
