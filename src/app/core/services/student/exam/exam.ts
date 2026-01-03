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

  getExams(): Observable<ApiResponse<ExamType[]>> {
    return this.http.get<ApiResponse<ExamType[]>>(
      `${this.baseUrl}/exams`
    );
  }

  submitExam(payload: CreateExamType): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/exams`,
      payload,
    );
  }

  getExamById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/exams/${id}`
    );
  }

  getExamMetaById(id: string): Observable<ApiResponse<Partial<ExamType>>> {
    return this.http.get<ApiResponse<Partial<ExamType>>>(
      `${this.baseUrl}/exams/meta/${id}`
    );
  }

  deleteExam(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/exams/${id}`
    );
  }
}
