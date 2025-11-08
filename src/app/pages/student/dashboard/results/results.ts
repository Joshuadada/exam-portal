import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [CommonModule, FormsModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  circumference = 2 * Math.PI * 40;

  searchTerm = '';
  selectedFilter = 'all';

  results = [
    {
      examTitle: 'Object-Oriented Programming',
      score: 85,
      grade: 'A',
      status: 'Passed',
      dateTaken: '2025-10-10',
      scoreColor: '#10B981'
    },
    {
      examTitle: 'Database Systems',
      score: 62,
      grade: 'C',
      status: 'Passed',
      dateTaken: '2025-09-25',
      scoreColor: '#3B82F6'
    },
    {
      examTitle: 'Software Engineering Principles',
      score: 48,
      grade: 'F',
      status: 'Failed',
      dateTaken: '2025-08-14',
      scoreColor: '#EF4444'
    }
  ];

  filteredResults = [...this.results];

  constructor(private router: Router) { }

  getDashOffset(score: number) {
    const progress = (score / 100) * this.circumference;
    return this.circumference - progress;
  }

  filterResults() {
    this.filteredResults = this.results.filter((r) => {
      const matchesSearch =
        r.examTitle.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFilter =
        this.selectedFilter === 'all' ||
        (this.selectedFilter === 'passed' && r.status === 'Passed') ||
        (this.selectedFilter === 'failed' && r.status === 'Failed');

      return matchesSearch && matchesFilter;
    });
  }

  viewDetails(result: any) {
    this.router.navigate(['/student/exams/result']);
  }
}
