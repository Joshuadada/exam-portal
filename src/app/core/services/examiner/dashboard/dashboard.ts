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

  getExaminerRecentExams(): Observable<ApiResponse<ExamType[]>> {
    return this.http.get<ApiResponse<ExamType[]>>(
      `${this.baseUrl}/exams/logged-in-lecturer/recent`
    );
  }

  getExaminerDashboardData(): Observable<ApiResponse<{examCount: number, studentCount: number}>> {
    return this.http.get<ApiResponse<{examCount: number, studentCount: number}>>(
      `${this.baseUrl}/dashboard/examiner`
    );
  }
}
