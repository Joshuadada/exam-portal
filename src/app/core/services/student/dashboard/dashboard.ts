import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/api-response.type';
import { ResultSummaryType } from '../../../types/result.type';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getRecentResults(): Observable<ApiResponse<ResultSummaryType[]>> {
    return this.http.get<ApiResponse<ResultSummaryType[]>>(
      `${this.baseUrl}/result/student-results/recent`
    );
  }

  getStudentDashboardData(): Observable<ApiResponse<{
    availableExamCount: number,
    attemptedExamCount: number,
    averageScore: string
  }>> {
    return this.http.get<ApiResponse<{
      availableExamCount: number,
      attemptedExamCount: number,
      averageScore: string
    }>>(
      `${this.baseUrl}/dashboard/student`
    );
  }
}
