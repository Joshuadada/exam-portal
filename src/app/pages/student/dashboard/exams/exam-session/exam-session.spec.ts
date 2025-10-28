import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSession } from './exam-session';

describe('ExamSession', () => {
  let component: ExamSession;
  let fixture: ComponentFixture<ExamSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSession);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
