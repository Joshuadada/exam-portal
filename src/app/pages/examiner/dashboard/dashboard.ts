import { Component } from '@angular/core';
import { Sidebar } from "../../../layout/dashboard/sidebar/sidebar";
import { Header } from "../../../layout/dashboard/header/header";
import { RouterModule } from "@angular/router";

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Header, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/examiner/home' },
    { label: 'Exams', icon: 'fas fa-file-alt', route: '/examiner/exams' },
    { label: 'Results', icon: 'fas fa-chart-line', route: '/examiner/results' },
  ];  
}
