import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInput } from "../../components/text-input/text-input";

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
})
export class EditProfileDialog {
  passwordForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      alert('✅ Password changed successfully!');
      this.passwordForm.reset();
    }, 1200);
  }

  get f() {
    return this.passwordForm.controls;
  }
}
