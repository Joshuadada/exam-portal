import { Component, inject } from '@angular/core';
import { TextInput } from "../../../shared/components/text-input/text-input";
import { Button } from "../../../shared/components/button/button";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthLayout } from "../../../layout/auth/auth-layout/auth-layout";
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertService } from '../../../core/services/shared/alert/alert.service';
import { UtilsService } from '../../../core/services/shared/utils/utils.service';

@Component({
  selector: 'app-login',
  imports: [TextInput, Button, AuthLayout, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private utilsService = inject(UtilsService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;
    localStorage.clear()

    this.authService
      .login(this.loginForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.isSuccessful === true) {
            const accessToken = res?.data?.access_token as string;

            this.alertService.success(res?.message);

            localStorage.setItem('exam-portal-access-token', accessToken)
            localStorage.setItem('user', JSON.stringify(res?.data?.user))
            
            if(res?.data?.user?.role === 'student') {
              this.router.navigate(['/student'])
            } else {
              this.router.navigate(['/examiner'])
            }
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

  register() {
    this.router.navigate(['/register'])
  }
}
