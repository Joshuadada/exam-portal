import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertService } from '../../../core/services/shared/alert/alert.service';
import { UtilsService } from '../../../core/services/shared/utils/utils.service';
import { AuthLayout } from '../../../layout/auth/auth-layout/auth-layout';
import { Button } from '../../../shared/components/button/button';
import { TextInput } from '../../../shared/components/text-input/text-input';

@Component({
  selector: 'app-register',
  imports: [TextInput, Button, AuthLayout, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm!: FormGroup;
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private utilsService = inject(UtilsService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      studentId: new FormControl('', [Validators.required]),
    });
  }

  register(): void {
    if (this.registerForm.invalid) return;

    const payload = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      full_name: this.registerForm.value.fullName,
      role: this.registerForm.value.role,
      department: this.registerForm.value.department,
      student_id: this.registerForm.value.studentId
    }

    this.authService
      .register(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            const accessToken = res?.data?.accessToken as string;
            const refreshToken = res?.data?.refreshToken as string;

            this.utilsService.setTokens(accessToken, refreshToken);

            this.alertService.success(res?.message);
            this.router.navigate(['/student'])

          } else {
            this.alertService.error(res?.message || res?.error || 'An error occurred');
          }
        },
        error: (err) => {
          this.alertService.error(err?.error?.message || 'An error occurred');
          console.error('Login API error:', err);
        },
      });
  }

  login() {
    this.router.navigate(['/login'])
  }
}
