import { Component, inject } from '@angular/core';
import { TextInput } from "../../../../shared/components/text-input/text-input";
import { Button } from "../../../../shared/components/button/button";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthLayout } from "../../../../layout/auth/auth-layout/auth-layout";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [TextInput, Button, AuthLayout, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  private router = inject(Router)
  
  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.router.navigate(['/examiner'])
  }

  signInAsExaminer(){
    this.router.navigate(['/login'])
  }
}
