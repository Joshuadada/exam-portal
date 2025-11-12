import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface SubQuestion {
  label: string;
  questionText: string;
  marks: number;
}

interface Question {
  number: string;
  subQuestions: SubQuestion[];
}

interface MarkingScheme {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
}

interface ExamDetailsInterface {
  id: string;
  title: string;
  instructions: string;
  duration: number;
  markingScheme: MarkingScheme | null;
  questions: Question[];
  createdAt?: Date;
  updatedAt?: Date;
  totalMarks?: number;
}

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.scss',
})
export class ExamDetails implements OnInit {
  exam: ExamDetailsInterface | null = null;
  loading: boolean = true;
  examId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get exam ID from route params
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    
    // Load exam details
    this.loadExamDetails();
  }

  loadExamDetails(): void {
    this.loading = true;
    
    // TODO: Replace with actual API call
    // this.examService.getExamById(this.examId).subscribe(...)
    
    // Mock data for demonstration
    setTimeout(() => {
      this.exam = {
        id: this.examId,
        title: 'Object-Oriented Programming Mid-Term Exam',
        instructions: '<p>Read all questions carefully before attempting.</p><ul><li>Answer all questions</li><li>Write clearly and legibly</li><li>Time management is crucial</li></ul>',
        duration: 120,
        markingScheme: {
          fileName: 'OOP_Marking_Scheme.pdf',
          fileSize: 2457600, // 2.4 MB
          fileType: 'application/pdf',
          fileUrl: '#'
        },
        questions: [
          {
            number: '1',
            subQuestions: [
              {
                label: 'a',
                questionText: '<p>Define encapsulation and explain its importance in OOP.</p>',
                marks: 5
              },
              {
                label: 'b',
                questionText: '<p>Write a Java class demonstrating encapsulation with private fields and public getter/setter methods.</p>',
                marks: 10
              }
            ]
          },
          {
            number: '2',
            subQuestions: [
              {
                label: 'a',
                questionText: '<p>Explain the difference between method overloading and method overriding.</p>',
                marks: 8
              },
              {
                label: 'b',
                questionText: '<p>Provide code examples for both concepts.</p>',
                marks: 12
              }
            ]
          },
          {
            number: '3',
            subQuestions: [
              {
                label: 'a',
                questionText: '<p>What is polymorphism? Describe its types with examples.</p>',
                marks: 15
              }
            ]
          }
        ],
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-12'),
      };
      
      // Calculate total marks
      this.exam.totalMarks = this.calculateTotalMarks();
      this.loading = false;
    }, 500);
  }

  calculateTotalMarks(): number {
    if (!this.exam) return 0;
    
    return this.exam.questions.reduce((total, question) => {
      const questionTotal = question.subQuestions.reduce((subTotal, sub) => {
        return subTotal + (sub.marks || 0);
      }, 0);
      return total + questionTotal;
    }, 0);
  }

  getQuestionTotalMarks(question: Question): number {
    return question.subQuestions.reduce((total, sub) => {
      return total + (sub.marks || 0);
    }, 0);
  }

  formatFileSize(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(2);
  }

  downloadMarkingScheme(): void {
    if (this.exam?.markingScheme?.fileUrl) {
      alert('Download marking scheme: ' + this.exam.markingScheme.fileName);
    }
  }

  editExam(): void {
    this.router.navigate(['/examiner/exams/edit']);
  }

  deleteExam(): void {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      alert('Exam deleted successfully!');
      this.router.navigate(['/exams']);
    }
  }

  goBack(): void {
    this.router.navigate(['/exams']);
  }
}