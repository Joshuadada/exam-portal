
import { Component, Input, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { sidebarOpen, toggleSidebar } from '../../../core/state/ui.store';
import { UtilsService } from '../../../core/services/shared/utils/utils.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sidebarOpen = sidebarOpen;
  toggleSidebar = toggleSidebar;

  constructor(private router: Router, private utilsService: UtilsService) {}
  @Input({required: true}) navItems: NavItem[] = [];

  logout() {
    this.utilsService.logout()
  }
}
