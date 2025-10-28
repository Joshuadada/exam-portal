import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exam-instruction',
  imports: [],
  templateUrl: './exam-instruction.html',
  styleUrl: './exam-instruction.scss',
})
export class ExamInstruction {
  exam = {
    id: 1,
    title: 'Computer Science 101',
    duration: '60 mins',
    questions: 5
  };

  constructor(private router: Router, private route: ActivatedRoute) { }

  goBack() {
    this.router.navigate(['/student/exams']);
  }

  proceedToExam(id: number) {
    this.router.navigate([`/student/exams/${id}/start`]);
  }
}
