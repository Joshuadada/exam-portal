import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

type SubQuestionResult = {
  label: string;           // 'a', 'b', ...
  text: string;            // question text
  studentAnswer: string;   // the student's submitted answer (string or html)
  llmReview: string;       // evaluation comment by LLM
  awardedMarks: number;    // marks awarded
  maxMarks: number;        // maximum marks for the subpart
};

type QuestionGroup = {
  number: number;                  // 1, 2, ...
  subQuestions: SubQuestionResult[];
};

@Component({
  selector: 'app-result-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './result-details.html',
  styleUrl: './result-details.scss',
})
export class ResultDetails implements OnInit {
  examId?: string | null;
  studentId?: string | null;

  // Mock top-level summary (would come from API)
  examMeta = {
    title: 'Software Engineering Fundamentals',
    courseCode: 'CSE401',
    date: 'Nov 08, 2025',
    duration: '2 hours',
  };

  student = {
    name: 'Jane Doe',
    matricNo: 'CSC/21/0012',
    department: 'Computer Science',
  };

  totalScore = 0;
  maxTotal = 0;
  grade = '';
  status: 'Passed' | 'Failed' = 'Passed';

  questions: QuestionGroup[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.studentId = this.route.snapshot.paramMap.get('studentId');

    // In real app: fetch data using examId & studentId.
    // For now, populate mock data:
    this.loadMockResult();
    this.calculateTotals();
  }

  backToResults() {
    // Prefer going back; otherwise navigate to results list
    this.router.navigate(['../'], { relativeTo: this.route }).catch(() => {
      this.router.navigate(['/examiner/results']);
    });
  }

  private loadMockResult() {
    this.questions = [
      {
        number: 1,
        subQuestions: [
          {
            label: 'a',
            text: 'Define polymorphism in Object-Oriented Programming.',
            studentAnswer:
              'Polymorphism is the ability of an object to take many forms — e.g., method overriding and overloading allow methods to behave differently based on inputs or object type.',
            llmReview:
              'Good concise definition and example. Could add more about runtime vs compile-time polymorphism.',
            awardedMarks: 8,
            maxMarks: 10,
          },
          {
            label: 'b',
            text: 'Differentiate between overloading and overriding.',
            studentAnswer:
              'Overloading is when multiple methods share the same name but have different parameters. Overriding is redefining a method in a subclass.',
            llmReview:
              'Correct and well-explained. Example would improve the answer.',
            awardedMarks: 9,
            maxMarks: 10,
          },
          {
            label: 'c',
            text: 'List two advantages of polymorphism.',
            studentAnswer: 'Code reusability and easier maintenance.',
            llmReview: 'Correct, concise.',
            awardedMarks: 4,
            maxMarks: 5,
          },
        ],
      },
      {
        number: 2,
        subQuestions: [
          {
            label: 'a',
            text: 'Explain the purpose of encapsulation.',
            studentAnswer:
              'Encapsulation wraps data and methods together and restricts direct access to an object\'s data.',
            llmReview:
              'Good. Could include example of access modifiers (private/public).',
            awardedMarks: 5,
            maxMarks: 5,
          },
          {
            label: 'b',
            text: 'Give an example where encapsulation improves security.',
            studentAnswer:
              'Hiding internal balances in a banking class prevents unauthorized updates.',
            llmReview: 'Practical example — acceptable',
            awardedMarks: 4,
            maxMarks: 5,
          },
        ],
      },
    ];
  }

  private calculateTotals() {
    let s = 0;
    let m = 0;
    for (const q of this.questions) {
      for (const sub of q.subQuestions) {
        s += sub.awardedMarks;
        m += sub.maxMarks;
      }
    }
    this.totalScore = s;
    this.maxTotal = m;

    const pct = m > 0 ? Math.round((s / m) * 100) : 0;
    this.grade = this.computeGrade(pct);
    this.status = pct >= 50 ? 'Passed' : 'Failed';
  }

  private computeGrade(pct: number) {
    if (pct >= 85) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 55) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  }
}
