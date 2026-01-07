import { Component, Input } from '@angular/core';
import { toggleSidebar } from '../../../core/state/ui.store';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  toggleSidebar = toggleSidebar;
  @Input({required: true}) portalName!: string;

  user = JSON.parse(localStorage.getItem('user') || "{}")
}
