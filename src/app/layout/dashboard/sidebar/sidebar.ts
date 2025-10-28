import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { sidebarOpen, toggleSidebar } from '../../../core/state/ui.store';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarOpen = sidebarOpen;
  toggleSidebar = toggleSidebar;

  constructor(private router: Router) {}
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/student/dashboard' },
    { label: 'Exams', icon: 'fas fa-file-alt', route: '/student/exams' },
    { label: 'Results', icon: 'fas fa-chart-bar', route: '/student/results' },
    { label: 'Feedback', icon: 'fas fa-comment-dots', route: '/student/feedback' },
    { label: 'Settings', icon: 'fas fa-cog', route: '/student/settings' },
  ];

  logout() {
    this.router.navigate(['/logout']);
  }
}
