import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam-result',
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-result.html',
  styleUrl: './exam-result.scss',
})
export class ExamResult {
  private router = inject(Router);

  studentName = 'Joshua';

  result = {
    score: 85,
    timeSpent: '45 mins',
    grade: 'A',
    status: 'Passed',
    feedback:
      'Excellent performance! You demonstrated strong comprehension. You can focus more on concise explanations next time.',
    breakdown: [
      { type: 'Correct', count: 12 },
      { type: 'Wrong', count: 3 },
      { type: 'Unanswered', count: 0 },
    ],
    questions: [
      {
        label: '1',
        subQuestions: [
          {
            subPart: 'a',
            text: 'Define polymorphism in Object-Oriented Programming.',
            answer: 'Polymorphism is the ability of an object to take many forms.',
            correctAnswer:
              'Polymorphism allows objects of different classes to be treated as objects of a common superclass.',
            feedback: 'You captured the essence, but missed a bit of detail.',
            isCorrect: true,
          },
          {
            subPart: 'b',
            text: 'Differentiate between overloading and overriding.',
            answer: 'Overloading changes the implementation of a method in a subclass.',
            correctAnswer:
              'Overloading means multiple methods with same name but different parameters, while overriding means redefining a method in a subclass.',
            feedback: 'Partially correct — you confused overriding with overloading.',
            isCorrect: false,
          },
        ],
      },
      {
        label: '2',
        subQuestions: [
          {
            subPart: 'a',
            text: 'Explain the purpose of encapsulation.',
            answer: 'Encapsulation hides the internal state of objects.',
            correctAnswer:
              'Encapsulation binds data and methods together while restricting access to internal data.',
            feedback: 'Correct, though you could mention data hiding more explicitly.',
            isCorrect: true,
          },
        ],
      },
    ],
  };

  summaryCards = [
    { label: 'Total Score', value: '85%', color: 'text-green-600' },
    { label: 'Time Spent', value: '45 mins', color: 'text-blue-600' },
    { label: 'Grade', value: 'A', color: 'text-yellow-600' },
    { label: 'Status', value: 'Passed', color: 'text-green-600' },
  ];

  circumference = 2 * Math.PI * 70;
  dashOffset = 0;
  scoreColor = '#22C55E';

  activeIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  ngOnInit() {
    const progress = this.result.score / 100;
    setTimeout(() => {
      this.dashOffset = this.circumference * (1 - progress);
      this.scoreColor = progress >= 0.5 ? '#22C55E' : '#EF4444';
    }, 300);
  }

  goToDashboard() {
   this.router.navigate(['/student/home'])
  }
}
