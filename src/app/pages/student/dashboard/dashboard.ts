import { Component } from '@angular/core';
import { Sidebar } from "../../../layout/dashboard/sidebar/sidebar";
import { Header } from "../../../layout/dashboard/header/header";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Header, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
