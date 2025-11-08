import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialog } from '../../../../shared/modals/edit-profile-dialog/edit-profile-dialog';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  user = {
    name: 'Joshua Babatunde',
    email: 'joshua.babatunde@example.com',
    role: 'Student',
    institution: 'University of Lagos',
    stats: {
      taken: 12,
      passed: 9,
      failed: 3,
      average: 75,
    },
  };

  constructor(private dialog: MatDialog) {}

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialog, {
      width: '600px',
      data: { ...this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user = result;
      }
    });
  }
}
