import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ExamType } from '../../../types/exam.type';
import { ApiResponse } from '../../../types/api-response.type';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getRecentExams(): Observable<ApiResponse<ExamType[]>> {
    return this.http.get<ApiResponse<ExamType[]>>(
      `${this.baseUrl}/exams/recent`
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
