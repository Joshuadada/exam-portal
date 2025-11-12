import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
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
  @Input({required: true}) navItems: NavItem[] = [];

  logout() {
    this.router.navigate(['/logout']);
  }
}
