import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type ApiResponse<T = void> = {
  data?: T;
  isSuccessful: boolean,
  error: string,
  responseStatus: '00' | '99' | string,
  responseCode?: any,
  statusCode: string,
  message: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  login(payload: { email: string, password: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/auth/login`,
      payload,
      {
        headers: { skip: 'true' }
      }
    );
  }

  register(payload: { email: string, password: string, full_name: string, role: string, department: string, student_id: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/auth/register`,
      payload,
      {
        headers: { skip: 'true' }
      }
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/auth/refresh-token

`,
      { refreshToken },
      {
        headers: { skip: 'true' }
      }
    )
  }

  logout() {
    return this.http.get<ApiResponse<any>>(
      `${this.baseUrl}/auth/log-out`
    );
  }
}
