import { Component } from '@angular/core';
import { TextInput } from "../../../../shared/components/text-input/text-input";
import { Button } from "../../../../shared/components/button/button";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthLayout } from "../../../../layout/auth/auth-layout/auth-layout";

@Component({
  selector: 'app-login',
  imports: [TextInput, Button, AuthLayout],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  
  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
