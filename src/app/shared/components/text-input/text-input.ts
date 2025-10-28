import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  @Input() control: FormControl = new FormControl();
  @Input() type: string = 'text';
  @Input() id!: string;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() customClass!: string;
  @Input() errorMessage: string = '';
  @Input() matchName: string = '';
  @Input() invalid!: any;
  @Input() pattern!: string;
  @Input() value?: string;
  @Input() name?: string;
  @Input() formCtrlName: any;
  @Input() max: any;
  @Input() min: any;
  @Input() formGrp!: FormGroup;
  @Input() maxLength?: string | number | null | undefined;
  @Input() minLength?: string | number | null | undefined;

  constructor() { }

  ngOnInit(): void { }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return dirty && touched && errors;
  }
}
