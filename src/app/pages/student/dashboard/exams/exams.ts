import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface Exam {
  id: number;
  title: string;
  duration: string;
  questions: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-exams',
  imports: [CommonModule, RouterModule],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  private router = inject(Router);

  exams = signal<Exam[]>([
    { id: 1, title: 'Artificial Intelligence Fundamentals', duration: '1 hr', questions: 5, status: 'Not Started' },
    { id: 2, title: 'Machine Learning Concepts', duration: '45 mins', questions: 4, status: 'In Progress' },
    { id: 3, title: 'Database Systems and Design', duration: '1 hr 30 mins', questions: 6, status: 'Completed' },
    { id: 1, title: 'Artificial Intelligence Fundamentals', duration: '1 hr', questions: 5, status: 'Not Started' },
    { id: 2, title: 'Machine Learning Concepts', duration: '45 mins', questions: 4, status: 'In Progress' },
  ]);

  startExam(examId: number) {
    const exam = this.exams().find(e => e.id === examId);
    if (exam) {
      this.router.navigate(['/student/exams/instruction'])
    }
  }
}
