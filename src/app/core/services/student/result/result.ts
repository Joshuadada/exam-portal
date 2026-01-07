import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResultSummaryType, ResultType } from '../../../types/result.type';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/api-response.type';

@Injectable({
  providedIn: 'root',
})
export class Result {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getStudentResults(): Observable<ApiResponse<ResultSummaryType[]>> {
    return this.http.get<ApiResponse<ResultSummaryType[]>>(
      `${this.baseUrl}/result/student-results`
    );
  }

  getStudentResultBySubmissionId(submissionId: string): Observable<ApiResponse<ResultType>> {
    return this.http.get<ApiResponse<ResultType>>(
      `${this.baseUrl}/result/student-results/${submissionId}`
    );
  }
}
