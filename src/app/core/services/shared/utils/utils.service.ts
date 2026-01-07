import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly accessTokenKey = 'exam-portal-access-token';
  private isClearing = false;

  private router = inject(Router);

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  clearTokens(): void {
    if (this.isClearing) return;
    this.isClearing = true;

    localStorage.removeItem(this.accessTokenKey);

    this.isClearing = false;
  }

  // ================================
  // 🔹 TOKEN DECODING & VALIDATION
  // ================================

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  isTokenExpired(decoded: any): boolean {
    if (!decoded?.exp) return true;
    return Date.now() > decoded.exp * 1000;
  }

  // ================================
  // 🔹 AUTH STATE MANAGEMENT
  // ================================

  logout(): void {
    // this.authService.logout().pipe(finalize(() => {
    //   this.clearTokens();
    //   this.router.navigate(['/auth/login'])
    // })).subscribe()
    this.clearTokens();
    localStorage.removeItem('user')
    this.router.navigate(['/login'])
  }
}
