import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../types/api-response.type';
import { LecturerResultSummaryType, LecturerResultType } from '../../../types/result.type';

@Injectable({
  providedIn: 'root',
})
export class ExaminerResultService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getLecturerStudentResults(): Observable<ApiResponse<LecturerResultSummaryType[]>> {
    return this.http.get<ApiResponse<LecturerResultSummaryType[]>>(
      `${this.baseUrl}/result/lecturer-student-results`
    );
  }

  getLecturerStudentResultBySubmissionId(submissionId: string): Observable<ApiResponse<LecturerResultType>> {
    return this.http.get<ApiResponse<LecturerResultType>>(
      `${this.baseUrl}/result/lecturer-student-results/${submissionId}`
    );
  }
}
