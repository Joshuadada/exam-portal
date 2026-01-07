import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '../services/shared/utils/utils.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const utilsService = inject(UtilsService);
  const router = inject(Router);

  /**
   * Skip interceptor logic if `skip` header is present
   */
  if (req.headers.has('skip')) {
    const headers = req.headers.delete('skip');
    return next(req.clone({ headers }));
  }

  /**
   * Attach Authorization header if token exists
   */
  const token = utilsService.getToken();
  const authReq = token ? addTokenHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        utilsService.clearTokens();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(
  request: HttpRequest<any>,
  token: string
): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}