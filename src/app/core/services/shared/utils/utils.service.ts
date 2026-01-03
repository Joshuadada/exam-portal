import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, map } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly accessTokenKey = 'exam-portal-access-token';
  private readonly refreshTokenKey = 'exam-portal-refresh-token';
  private isClearing = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  private decodedTokenSubject = new BehaviorSubject<any | null>(this.getDecodedToken());
  decodedToken$ = this.decodedTokenSubject.asObservable();

  // ================================
  // 🔹 TOKEN MANAGEMENT
  // ================================

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.decodedTokenSubject.next(this.getDecodedToken());
  }

  updateToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    this.decodedTokenSubject.next(this.getDecodedToken());
  }

  clearTokens(): void {
    if (this.isClearing) return;
    this.isClearing = true;

    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.decodedTokenSubject.next(null);

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

  isLoggedIn$ = this.decodedToken$.pipe(
    map((decoded) => !!decoded && !this.isTokenExpired(decoded)),
    distinctUntilChanged()
  );
}
