import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface StudentResult {
  name: string;
  matricNo: string;
  courseCode: string;
  courseTitle: string;
  ExamDate: string;
  score: number;
  grade: string;
  status: 'Passed' | 'Failed';
}

@Component({
  selector: 'app-result',
  imports: [CommonModule, RouterModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  private router = inject(Router)
  
  examSummary = {
    title: 'Software Engineering Fundamentals',
    date: 'October 5, 2025',
    totalCandidates: 25,
    averageScore: 78,
    passRate: 80,
  };

  results: StudentResult[] = [
    { name: 'John Doe', matricNo: "200667755", courseCode: "CSC 201", courseTitle:"Basics of Programing", ExamDate: "22/11/2025", score: 92, grade: 'A', status: 'Passed' },
    { name: 'Jane Smith', matricNo: "200667755", courseCode: "CSC 201", courseTitle:"Basics of Programing", ExamDate: "22/11/2025", score: 75, grade: 'B', status: 'Passed' },
    { name: 'David Okoro', matricNo: "200667755", courseCode: "CSC 201", courseTitle:"Basics of Programing", ExamDate: "22/11/2025", score: 48, grade: 'D', status: 'Failed' },
    { name: 'Mary Johnson', matricNo: "200667755", courseCode: "CSC 201", courseTitle:"Basics of Programing", ExamDate: "22/11/2025", score: 85, grade: 'A', status: 'Passed' },
  ];

  viewDetails(student: StudentResult) {
    this.router.navigate(['/examiner/results/details'])
  }
}
