import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../types/api-response.type';
import { UserResponseType } from '../../types/auth.type';

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

  register(payload: { email: string, password: string, fullName: string, role: string, department: string, identity: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/auth/register`,
      payload,
      {
        headers: { skip: 'true' }
      }
    );
  }

  getProfile(): Observable<ApiResponse<UserResponseType>> {
    return this.http.get<ApiResponse<UserResponseType>>(
      `${this.baseUrl}/auth/profile`
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
