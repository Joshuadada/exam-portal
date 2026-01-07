import { Component, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { AlertService } from '../../../../core/services/shared/alert/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { UserResponseType } from '../../../../core/types/auth.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private authService = inject(AuthService)
  private alertService = inject(AlertService)
  private destroy$ = new Subject<void>();

  profileData!: UserResponseType | null

  constructor() { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            this.profileData = res.data || null
          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Exam API error:', err);
        },
      });
  }
}
