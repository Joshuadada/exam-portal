import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface Exam {
  id: number;
  title: string;
  courseCode: string;
  duration: string;
  status: 'Published' | 'Draft';
  questionCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-exams',
  imports: [CommonModule, RouterModule],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams {
  private router = inject(Router)

  exams: Exam[] = [
    {
      id: 1,
      title: 'Object-Oriented Programming',
      courseCode: "CSC 201",
      duration: '60 mins',
      status: 'Published',
      questionCount: 6,
      createdAt: 'Oct 12, 2025',
    },
    {
      id: 2,
      title: 'Database Systems',
      courseCode: "CSC 201",
      duration: '45 mins',
      status: 'Draft',
      questionCount: 4,
      createdAt: 'Nov 5, 2025',
    },
    {
      id: 3,
      title: 'Software Engineering',
      courseCode: "CSC 201",
      duration: '90 mins',
      status: 'Published',
      questionCount: 8,
      createdAt: 'Sep 25, 2025',
    },
  ];

  getStatusClass(status: string) {
    return status === 'Published'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  }

  onCreateExam() {
    this.router.navigate(['examiner/exams/create']);
  }

  onEdit(exam: Exam) {
    this.router.navigate(['examiner/exams/edit'])
    console.log('Editing', exam.title);
  }

  onView(exam: Exam) {
    this.router.navigate(['examiner/exams/details'])
    console.log('Viewing', exam.title);
  }

  onDelete(exam: Exam) {
    if (confirm(`Delete ${exam.title}?`)) {
      this.exams = this.exams.filter((e) => e.id !== exam.id);
    }
  }
}
