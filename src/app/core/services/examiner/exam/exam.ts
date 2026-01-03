import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../types/api-response.type';
import { CreateExamType, ExamType } from '../../../types/exam.type';

@Injectable({
  providedIn: 'root',
})
export class Exam {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getExaminerExams(): Observable<ApiResponse<ExamType[]>> {
    return this.http.get<ApiResponse<ExamType[]>>(
      `${this.baseUrl}/exams/logged-in-lecturer`
    );
  }

  createExam(payload: CreateExamType): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/exams`,
      payload,
    );
  }

  getExamById(id: string): Observable<ApiResponse<ExamType>> {
    return this.http.get<ApiResponse<ExamType>>(
      `${this.baseUrl}/exams/${id}`
    );
  }

  deleteExam(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/exams/${id}`
    );
  }
}
