import { TestBed } from '@angular/core/testing';

import { ExaminerResultService } from './examiner-result-service';

describe('ExaminerResultService', () => {
  let service: ExaminerResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExaminerResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
