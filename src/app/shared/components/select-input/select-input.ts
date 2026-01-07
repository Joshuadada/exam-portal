import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-input.html',
  styleUrl: './select-input.scss',
})
export class SelectInput {
  @Input() control: FormControl = new FormControl();
  @Input() formGrp!: FormGroup;
  @Input() formCtrlName!: string;
  @Input() id!: string;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() customClass: string = '';
  @Input() options: { value: any; label: string }[] = [];
  @Input() name: string = '';
  @Input() errorMessage: string = '';
  @Input() matchName: string = '';

  constructor() { }

  displayErrors() {
    const { dirty, touched, errors } = this.control;
    return dirty && touched && errors;
  }
}
