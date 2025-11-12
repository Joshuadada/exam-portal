import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  summaryCards = [
    { label: 'Total Exams', value: 12, icon: 'fas fa-book' },
    { label: 'Active Exams', value: 4, icon: 'fas fa-play-circle' },
    { label: 'Pending Reviews', value: 3, icon: 'fas fa-tasks' },
    { label: 'Students', value: 128, icon: 'fas fa-users' },
  ];

  recentExams = [
    {
      title: 'Object-Oriented Programming',
      duration: '1 hr',
      attempts: 56,
      status: 'Active',
      date: 'Nov 5, 2025',
    },
    {
      title: 'Database Systems',
      duration: '45 mins',
      attempts: 43,
      status: 'Draft',
      date: 'Nov 2, 2025',
    },
    {
      title: 'Software Engineering Principles',
      duration: '1 hr 30 mins',
      attempts: 71,
      status: 'Closed',
      date: 'Oct 28, 2025',
    },
  ];
}
