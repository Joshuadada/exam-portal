import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInstruction } from './exam-instruction';

describe('ExamInstruction', () => {
  let component: ExamInstruction;
  let fixture: ComponentFixture<ExamInstruction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamInstruction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamInstruction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
