import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UtilsService } from '../services/shared/utils/utils.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const utilsService = inject(UtilsService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip header logic
  if (req.headers.has('skip')) {
    const headers = req.headers.delete('skip');
    const modifiedReq = req.clone({ headers });
    return next(modifiedReq);
  }

  // Add Authorization header if token exists
  const token = utilsService.getToken();
  let authReq = req;
  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next, authService, utilsService, router);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  utilsService: UtilsService,
  router: Router
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = utilsService.getRefreshToken();

    if (!refreshToken) {
      utilsService.clearTokens();
      router.navigate(['/auth/login']);
          return of();
    }

    return authService.refreshToken(refreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;
        const newAccessToken = res?.data?.accessToken;
        const newRefreshToken = res?.data?.refreshToken;

        if (newAccessToken && newRefreshToken) {
          utilsService.setTokens(newAccessToken, newRefreshToken);
          refreshTokenSubject.next(newAccessToken);
          return next(addTokenHeader(req, newAccessToken));
        } else {
          utilsService.clearTokens();
          router.navigate(['/auth/login']);
          return of();
        }
      }),
      catchError((err) => {
        isRefreshing = false;
        utilsService.clearTokens();
        router.navigate(['/auth/login']);
          return of();
      })
    );
  } else {
    // Wait until token refresh completes
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(req, token!)))
    );
  }
}
